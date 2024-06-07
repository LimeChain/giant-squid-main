import {
    Event as _Event,
    Call as _Call,
    Extrinsic as _Extrinsic,
    Block as _Block,
    BlockHeader as _BlockHeader,
    DataHandlerContext,
    SubstrateBatchProcessor,
    SubstrateBatchProcessorFields,
    FieldSelection,
} from '@subsquid/substrate-processor'
import { StoreWithCache, TypeormDatabaseWithCache } from '@belopash/typeorm-store';

const fields = {
    block: {
        timestamp: true,
    },
    call: {
        name: true,
        args: true,
        origin: true,
        success: true,
        extrinsic: true,
    },
    event: {
        name: true,
        args: true,
        call: true,
        extrinsic: true,
    },
    extrinsic: {
        hash: true,
        success: true,
    },
} as FieldSelection;

// export const processor = new SubstrateBatchProcessor()
// .setGateway(chain.config.gateway)
// .setRpcEndpoint(chain.config.endpoint)
// .setFields(fields)
// .addEvent({
//     name: [
//         'Balances.Transfer',
//         'Staking.Reward',
//         'Staking.Rewarded',
//         'Identity.SubIdentityRemoved',
//         'Identity.SubIdentityRevoked'
//     ],
//     call: true,
//     extrinsic: true,
// })
// .addCall({
//     name: [
//         'Identity.set_identity',
//         'Identity.provide_judgement',
//         'Identity.set_subs',
//         'Identity.rename_sub',
//         'Identity.add_sub',
//         'Identity.clear_identity',
//         'Identity.kill_identity'
//     ],
//     extrinsic: true,

// })

// if (chain.config.blockRange) processor.setBlockRange(chain.config.blockRange)
// if (chain.config.typesBundle) processor.setTypesBundle(chain.config.typesBundle)


export class Processor {
    processor: SubstrateBatchProcessor<typeof fields>;
    database: TypeormDatabaseWithCache;
    constructor(db: TypeormDatabaseWithCache, config: any) {
        this.database = db
        this.processor = new SubstrateBatchProcessor()
            .setFields(fields)
            .setGateway(config.gateway)
            .setRpcEndpoint(config.endpoint)

        if (config.blockRange) {
            this.processor.setBlockRange(config.blockRange)
        }

        if (config.typesBundle) {
            this.processor.setTypesBundle(config.typesBundle)
        }
    }

    addEvents(events: string[]) {
        this.processor.addEvent({
            name: events
        })
    }

    addCalls(calls: string[]) {
        this.processor.addEvent({
            name: calls
        })
    }

    start(callback: (ctx: any) => Promise<void>) {
        this.processor.run(this.database, async (ctx) => {
            await callback(ctx);
        });

    }
}
export type Fields = SubstrateBatchProcessorFields<typeof fields>
export type Block = _Block<Fields>
export type BlockHeader = _BlockHeader<Fields>
export type Event = _Event<Fields>
export type Call = _Call<Fields>
export type Extrinsic = _Extrinsic<Fields>
export type ProcessorContext = DataHandlerContext<StoreWithCache, Fields>
