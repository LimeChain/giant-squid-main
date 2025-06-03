//@ts-ignore
import { Pool, PoolStatus } from '@/model';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { UpdatePoolAction } from '@/indexer/actions/nomination-pools/pool';

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

    queue.push(
      new UpdatePoolAction(block.header, event.extrinsic, {
        pool: () => pool.getOrFail(),
        status: PoolStatus.Destroyed,
        totalBonded: BigInt(0),
      })
    );
  }
}
