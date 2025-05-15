import { Account, HistoryElementType, Pool, PoolStatus } from '@/model';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { UpdatePoolAction } from '@/indexer/actions/nomination-pools/pool';
import { EnsureAccount, HistoryElementAction } from '@/indexer/actions';
import { getOriginAccountId } from '@/utils';

export interface INominationPoolsStateChangedEventPalletDecoder extends IEventPalletDecoder<{ poolId: string; newState: PoolStatus }> {}

interface INominationPoolsStateChangedEventPalletSetup extends IBasePalletSetup {
  decoder: INominationPoolsStateChangedEventPalletDecoder;
}

export class NominationPoolsStateChangedEventPalletHandler extends EventPalletHandler<INominationPoolsStateChangedEventPalletSetup> {
  constructor(setup: INominationPoolsStateChangedEventPalletSetup, options: IHandlerOptions) {
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
        status: data.newState,
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
