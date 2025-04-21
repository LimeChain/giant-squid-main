// @ts-ignore
import { PoolStatus } from '@/model';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { EnsurePool } from '@/indexer/actions/nomination-pools/pool';

export interface INominationPoolsDestroyedEventPalletDecoder extends IEventPalletDecoder<{ poolId: number }> {}

interface INominationPoolsDestroyedEventPalletSetup extends IBasePalletSetup {
  decoder: INominationPoolsDestroyedEventPalletDecoder;
}

export class NominationPoolsDestroyedEventPalletHandler extends EventPalletHandler<INominationPoolsDestroyedEventPalletSetup> {
  constructor(setup: INominationPoolsDestroyedEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);
    const poolId = data.poolId.toString();

    queue.push(
      new EnsurePool(block.header, event.extrinsic, {
        id: poolId,
        status: PoolStatus.Destroyed,
        totalBonded: BigInt(0),
      })
    );
  }
}
