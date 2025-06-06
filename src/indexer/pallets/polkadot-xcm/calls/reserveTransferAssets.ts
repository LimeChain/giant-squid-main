import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { Account } from '@/model';
import assert from 'assert';
import { getOriginAccountId } from '@/utils';
import { EnsureAccount } from '@/indexer/actions';
import { PolkadotXcmTransferAction } from '@/indexer/actions/polkadot-xcm/transfer';

export interface IReserveTransferAssetsPalletDecoder
  extends ICallPalletDecoder<{
    to: string;
    toChain: string;
    amount: bigint;
    feeAssetItem: number;
  }> {}

interface IReserveTransferAssetsPalletSetup extends IBasePalletSetup {
  decoder: IReserveTransferAssetsPalletDecoder;
  isEvmCompatable?: boolean;
}

export class ReserveTransferAssetsPalletHandler extends CallPalletHandler<IReserveTransferAssetsPalletSetup> {
  isEvmCompatable: boolean;

  constructor(setup: IReserveTransferAssetsPalletSetup, options: IHandlerOptions) {
    super(setup, options);
    this.isEvmCompatable = setup.isEvmCompatable || false;
  }

  async handle({ ctx, block, queue, item: call }: ICallHandlerParams) {
    if (!call.success) return;
    const { to, feeAssetItem, amount, toChain } = this.decoder.decode(call);

    // a supported call has been successfully decoded
    if (toChain) {
      const origin = getOriginAccountId(call.origin);
      assert(origin, 'Caller Pubkey is undefined');

      const fromPubKey = this.encodeAddress(this.isEvmCompatable ? call.origin.value.value : origin);

      const account = ctx.store.defer(Account, fromPubKey);

      queue.push(
        new EnsureAccount(block.header, call.extrinsic, {
          account: () => account.get(),
          id: fromPubKey,
          pk: this.decodeAddress(fromPubKey),
        }),
        new PolkadotXcmTransferAction(block.header, call.extrinsic, {
          id: call.id,
          account: () => account.getOrFail(),
          amount,
          to,
          toChain,
          call: call.name,
        })
      );
    }
  }
}
