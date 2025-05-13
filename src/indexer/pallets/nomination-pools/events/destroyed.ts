import { Account, HistoryElementType, Pool, PoolStatus } from '@/model';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { UpdatePoolAction } from '@/indexer/actions/nomination-pools/pool';
import { getOriginAccountId } from '@/utils';
import { EnsureAccount, HistoryElementAction } from '@/indexer/actions';

export interface INominationPoolsDestroyedEventPalletDecoder extends IEventPalletDecoder<{ poolId: string }> {}

interface INominationPoolsDestroyedEventPalletSetup extends IBasePalletSetup {
  decoder: INominationPoolsDestroyedEventPalletDecoder;
}

export class NominationPoolsDestroyedEventPalletHandler extends EventPalletHandler<INominationPoolsDestroyedEventPalletSetup> {
  constructor(setup: INominationPoolsDestroyedEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);
    const pool = ctx.store.defer(Pool, data.poolId);
    const origin = getOriginAccountId(event.call?.origin);

    if (!origin || !pool) {
      console.log('Invalid data or origin account ID');
      return;
    }

    const accountId = this.encodeAddress(origin);
    const account = ctx.store.defer(Account, accountId);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => account.get(), id: accountId, pk: this.decodeAddress(accountId) }),
      new UpdatePoolAction(block.header, event.extrinsic, {
        pool: () => pool.getOrFail(),
        status: PoolStatus.Destroyed,
        totalBonded: BigInt(0),
      }),
      new HistoryElementAction(block.header, event.extrinsic, {
        id: event.id,
        name: event.name,
        type: HistoryElementType.Event,
        account: () => account.getOrFail(),
      })
    );
  }
}
