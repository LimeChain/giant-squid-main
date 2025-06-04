// @ts-ignore
import { Account, Parachain } from '@/model';
import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { XcmTransferAction } from '@/indexer/actions/xcm/transfer';
import assert from 'assert';
import { getOriginAccountId } from '@/utils';
import { EnsureAccount } from '@/indexer/actions';

export interface ILimitedReserveTransferAssetsPalletDecoder
  extends ICallPalletDecoder<{
    to: string;
    toChain: string;
    amount: bigint;
    feeAssetItem: number;
    weightLimit: bigint | null;
  }> {}

interface ILimitedReserveTransferAssetsPalletSetup extends IBasePalletSetup {
  decoder: ILimitedReserveTransferAssetsPalletDecoder;
}

export class LimitedReserveTransferAssetsPalletHandler extends CallPalletHandler<ILimitedReserveTransferAssetsPalletSetup> {
  constructor(setup: ILimitedReserveTransferAssetsPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }
  async handle({ ctx, block, queue, item: call }: ICallHandlerParams) {
    if (!call.success) return;
    const { to, feeAssetItem, amount, toChain, weightLimit } = this.decoder.decode(call);

    // a supported call has been successfully decoded
    if (toChain) {
      const origin = getOriginAccountId(call.origin);
      assert(origin, `Caller Pubkey is undefined at ${call.extrinsic?.hash}`);

      const fromPubKey = this.encodeAddress(origin);

      const parachain = ctx.store.defer(Parachain, toChain);
      const account = ctx.store.defer(Account, fromPubKey);

      queue.push(
        new EnsureAccount(block.header, call.extrinsic, {
          account: () => account.get(),
          id: fromPubKey,
          pk: this.decodeAddress(fromPubKey),
        }),
        new XcmTransferAction(block.header, call.extrinsic, {
          id: call.id,
          account: () => account.getOrFail(),
          amount,
          to,
          toChain: () => parachain.get(),
          call: call.name,
          weightLimit,
        })
      );
    }
  }
}
