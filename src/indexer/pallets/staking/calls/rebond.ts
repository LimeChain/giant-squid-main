import { getOriginAccountId } from '@/utils';
import { Account, BondingType, Staker } from '@/model';
import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { BondAction, EnsureAccount, EnsureStaker } from '@/indexer/actions';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';

export interface IRebondCallPalletDecoder extends ICallPalletDecoder<{ amount: bigint }> {}

interface IRebondCallPalletSetup extends IBasePalletSetup {
  decoder: IRebondCallPalletDecoder;
}

export class RebondCallPalletHandler extends CallPalletHandler<IRebondCallPalletSetup> {
  constructor(setup: IRebondCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: call }: ICallHandlerParams) {
    if (call.success === false) return;

    const data = this.decoder.decode(call);

    const origin = getOriginAccountId(call.origin);

    if (!origin) return;

    const stakerId = this.encodeAddress(origin);

    const account = ctx.store.defer(Account, stakerId);
    const staker = ctx.store.defer(Staker, stakerId);

    queue.push(
      new EnsureAccount(block.header, call.extrinsic, { account: () => account.get(), id: stakerId, pk: this.decodeAddress(stakerId) }),
      new EnsureStaker(block.header, call.extrinsic, { id: stakerId, account: () => account.getOrFail(), staker: () => staker.get() }),
      new BondAction(block.header, call.extrinsic, {
        id: call.id,
        type: BondingType.Rebond,
        amount: data.amount,
        account: () => account.getOrFail(),
        staker: () => staker.getOrFail(),
      })
    );
  }
}
