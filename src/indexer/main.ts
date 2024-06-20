import { processItem } from '../utils';
import { Action } from './actions/base';
import { PalletMapper } from './mapper';
import { IndexerParams } from './types';
import { Processor, ProcessorContext } from './processor';
import { TypeormDatabaseWithCache } from '@belopash/typeorm-store';

export function setupPallet<T>(setup: T): T {
  return setup;
}

export class Indexer {
  private mapper: PalletMapper;
  private processor: Processor;

  constructor({ pallets, config }: IndexerParams) {
    this.mapper = new PalletMapper(pallets, { chain: config.chain });

    const events = this.mapper.getEvents();
    const calls = this.mapper.getCalls();

    this.processor = new Processor(new TypeormDatabaseWithCache({ supportHotBlocks: true }), config);

    this.processor.addEvents(events);
    this.processor.addCalls(calls);
  }

  async start() {
    this.processor.start(async (ctx: ProcessorContext) => {
      const queue: Action[] = [];

      processItem(ctx.blocks, (block, item) => {
        if (item.kind === 'event') {
          const pallet = this.mapper.getEventPallet(item.value.name)!;
          pallet.handle({ ctx, queue, block, item: item.value });
        }
        if (item.kind === 'call') {
          const pallet = this.mapper.getCallPallet(item.value.name)!;
          pallet.handle({ ctx, queue, block, item: item.value });
        }
      });

      await Action.process(ctx, queue);
      await ctx.store.flush();
    });
  }
}
