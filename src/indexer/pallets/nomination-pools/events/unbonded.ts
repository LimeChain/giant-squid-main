// @ts-ignore
import { Account, Pool, Staker } from '@/model';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';

import { EnsureAccount, EnsureStaker, UnbondPoolAction } from '@/indexer/actions';

export interface INominationPoolsUnbondedEventPalletDecoder
  extends IEventPalletDecoder<{ member: string; poolId: string; balance?: bigint; points?: any; era?: number }> {}

interface INominationPoolsUnbondedEventPalletSetup extends IBasePalletSetup {
  decoder: INominationPoolsUnbondedEventPalletDecoder;
}

export class NominationPoolsUnbondedEventPalletHandler extends EventPalletHandler<INominationPoolsUnbondedEventPalletSetup> {
  constructor(setup: INominationPoolsUnbondedEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);

    const poolId = data.poolId;
    const accountId = this.encodeAddress(data.member);

    const account = ctx.store.defer(Account, accountId);
    const staker = ctx.store.defer(Staker, accountId);
    const pool = ctx.store.defer(Pool, poolId);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => account.get(), id: accountId, pk: this.decodeAddress(accountId) }),
      new EnsureStaker(block.header, event.extrinsic, { id: accountId, account: () => account.getOrFail(), staker: () => staker.get() }),
      new UnbondPoolAction(block.header, event.extrinsic, {
        id: event.id,
        balance: data.balance,
        points: data.points,
        era: data.era,
        staker: () => staker.getOrFail(),
        pool: () => pool.getOrFail(),
      })
    );
  }
}
