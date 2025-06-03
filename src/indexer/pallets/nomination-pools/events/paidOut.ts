//@ts-ignore
import { Account, Pool, Staker } from '@/model';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { EnsureAccount, EnsureStaker, NominationPoolsBondAction, NominationPoolsPaidOutAction } from '@/indexer/actions';

export interface INominationPoolsPaidOutEventPalletDecoder extends IEventPalletDecoder<{ member: string; poolId: string; payout: bigint }> {}

interface INominationPoolsPaidOutEventPalletSetup extends IBasePalletSetup {
  decoder: INominationPoolsPaidOutEventPalletDecoder;
}

export class NominationPoolsPaidOutEventPalletHandler extends EventPalletHandler<INominationPoolsPaidOutEventPalletSetup> {
  constructor(setup: INominationPoolsPaidOutEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);
    const pool = ctx.store.defer(Pool, data.poolId);
    const memberId = this.encodeAddress(data.member);
    const account = ctx.store.defer(Account, memberId);
    const staker = ctx.store.defer(Staker, memberId);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => account.get(), id: memberId, pk: this.decodeAddress(memberId) }),
      new EnsureStaker(block.header, event.extrinsic, { id: memberId, account: () => account.getOrFail(), staker: () => staker.get() }),
      new NominationPoolsPaidOutAction(block.header, event.extrinsic, {
        id: event.id,
        payout: data.payout,
        staker: () => staker.getOrFail(),
        pool: () => pool.getOrFail(),
      })
    );
  }
}
