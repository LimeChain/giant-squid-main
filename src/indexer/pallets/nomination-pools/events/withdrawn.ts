//@ts-ignore
import { Account, Pool, Staker } from '@/model';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';

import { EnsureAccount, EnsureStaker } from '@/indexer/actions';
import { WithdrawnPoolAction } from '@/indexer/actions/nomination-pools/withdrawn';

export interface INominationPoolsWithdrawnEventPalletDecoder
  extends IEventPalletDecoder<{ member: string; poolId: string; balance: bigint; points?: bigint }> {}

interface INominationPoolsWithdrawnEventPalletSetup extends IBasePalletSetup {
  decoder: INominationPoolsWithdrawnEventPalletDecoder;
}

export class NominationPoolsWithdrawnEventPalletHandler extends EventPalletHandler<INominationPoolsWithdrawnEventPalletSetup> {
  constructor(setup: INominationPoolsWithdrawnEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);

    const poolId = data.poolId.toString();
    const accountId = this.encodeAddress(data.member);

    const account = ctx.store.defer(Account, accountId);
    const staker = ctx.store.defer(Staker, accountId);
    const pool = ctx.store.defer(Pool, poolId);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => account.get(), id: accountId, pk: this.decodeAddress(accountId) }),
      new EnsureStaker(block.header, event.extrinsic, { id: accountId, account: () => account.getOrFail(), staker: () => staker.get() }),
      new WithdrawnPoolAction(block.header, event.extrinsic, {
        id: event.id,
        balance: data.balance,
        points: data.points,
        staker: () => staker.getOrFail(),
        pool: () => pool.getOrFail(),
      })
    );
  }
}
