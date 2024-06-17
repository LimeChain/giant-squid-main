import { TypeormDatabaseWithCache } from '@belopash/typeorm-store';
import { Processor, ProcessorContext } from '../processor';
import { ensureEnvVariable, processItem } from '../utils/misc';
import { Action } from './actions/base';
import { PalletMapper } from '../indexer/mapper';
import { IndexerParams } from '../indexer/types';
import { lookupArchive } from '@subsquid/archive-registry';

export const createIndexer = async ({ config, decoders }: IndexerParams) => {
  config.gateway = lookupArchive(ensureEnvVariable('CHAIN'), { release: 'ArrowSquid' });

  const mapper = new PalletMapper(decoders, { chain: config.chain });

  const events = mapper.getEvents();
  const calls = mapper.getCalls();

  const processor = new Processor(new TypeormDatabaseWithCache({ supportHotBlocks: true }), config);

  processor.addEvents(events);
  processor.addCalls(calls);
  processor.start(async (ctx: ProcessorContext) => {
    const queue: Action[] = [];
    // const queue: any = {}; //new Queue();

    processItem(ctx.blocks, (block, item) => {
      if (item.kind === 'event') {
        const pallet = mapper.getEventPallet(item.value.name)!;
        pallet.handle({ ctx, queue, block, item: item.value });
      }
      if (item.kind === 'call') {
        const pallet = mapper.getCallPallet(item.value.name)!;
        pallet.handle({ ctx, queue, block, item: item.value });
      }
    });

    // await queue.execute();
    await Action.process(ctx, queue);
    await ctx.store.flush();
  });
};
