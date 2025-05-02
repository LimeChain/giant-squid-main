import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { Account } from '@/model';
import assert from 'assert';
import { getOriginAccountId } from '@/utils';
import { EnsureAccount } from '@/indexer/actions';
import { PolkadotXcmTransferAction } from '@/indexer/actions/polkadotXcm/transfer';

export interface ITransferAssetsUsingTypeAndThenPalletDecoder
  extends ICallPalletDecoder<{
    to: string;
    toChain: string;
    amount: bigint;
    feeAssetItem: number;
    weightLimit: bigint | null;
  }> {}

interface ITransferAssetsUsingTypeAndThenPalletSetup extends IBasePalletSetup {
  decoder: ITransferAssetsUsingTypeAndThenPalletDecoder;
  isEvmCompatable?: boolean;
}

export class TransferAssetsUsingTypeAndThenPalletHandler extends CallPalletHandler<ITransferAssetsUsingTypeAndThenPalletSetup> {
  isEvmCompatable: boolean;

  constructor(setup: ITransferAssetsUsingTypeAndThenPalletSetup, options: IHandlerOptions) {
    super(setup, options);
    this.isEvmCompatable = setup.isEvmCompatable || false;
  }

  async handle({ ctx, block, queue, item: call }: ICallHandlerParams) {
    if (!call.success) return;
    const { to, feeAssetItem, amount, toChain, weightLimit } = this.decoder.decode(call);

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
          feeAssetItem: feeAssetItem,
          amount,
          to,
          toChain,
          call: call.name,
          weightLimit,
          contractCalled: null,
          contractInput: null,
        })
      );
    }
  }
}
