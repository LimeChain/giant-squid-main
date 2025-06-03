//@ts-ignore
import { Pool, PoolStatus } from '@/model';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { UpdatePoolAction } from '@/indexer/actions/nomination-pools/pool';

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

    queue.push(
      new UpdatePoolAction(block.header, event.extrinsic, {
        pool: () => pool.getOrFail(),
        status: data.newState,
      })
    );
  }
}
