import { TypeormDatabaseWithCache } from "@belopash/typeorm-store";
import { Processor, ProcessorContext } from "./processor";
import { PalletMapper } from "./mapper";
import { IndexerParams } from "./types";
import { Action } from "./actions/base";
import { processItem } from "../utils";

export function setupPallet<T>(setup: T): T {
    return setup;
}

export async function createIndexer({ config, pallets }: IndexerParams) {
    const mapper = new PalletMapper(pallets, { chain: config.chain });

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