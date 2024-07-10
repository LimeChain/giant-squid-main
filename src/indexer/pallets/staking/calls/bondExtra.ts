import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { getOriginAccountId } from '@/utils';
import { BondAction, EnsureAccount, EnsureStaker } from '@/indexer/actions';
import { Account, BondingType, Staker } from '@/model';

export interface IBondExtraCallPalletDecoder extends ICallPalletDecoder<{ amount: bigint }> {}

interface IBondExtraCallPalletSetup extends IBasePalletSetup {
  decoder: IBondExtraCallPalletDecoder;
}

export class BondExtraCallPalletHandler extends CallPalletHandler<IBondExtraCallPalletSetup> {
  constructor(setup: IBondExtraCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: call }: ICallHandlerParams) {
    if (call.success === false) return;
    // Make sure the call is not already handled in the Bonded event handler
    if (call.extrinsic?.events.some((e) => e.name === 'Staking.Bonded')) return;

    const origin = getOriginAccountId(call.origin);
    const data = this.decoder.decode(call);

    if (!origin) return;

    const stashId = this.encodeAddress(origin);

    const stash = ctx.store.defer(Account, stashId);
    const staker = ctx.store.defer(Staker, stashId);

    queue.push(
      new EnsureAccount(block.header, call.extrinsic, { account: () => stash.get(), id: stashId, pk: this.decodeAddress(stashId) }),
      new EnsureStaker(block.header, call.extrinsic, { id: stashId, account: () => stash.getOrFail(), staker: () => staker.get() }),
      new BondAction(block.header, call.extrinsic, {
        id: call.id,
        type: BondingType.BondExtra,
        amount: data.amount,
        account: () => stash.getOrFail(),
        staker: () => staker.getOrFail(),
      })
    );
  }
}
