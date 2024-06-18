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
} from '@subsquid/substrate-processor';
import { lookupArchive } from '@subsquid/archive-registry';
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

export type ProcessorConfig = {
  chain: string;
  endpoint: Parameters<SubstrateBatchProcessor<any>['setRpcEndpoint']>[0];
  gateway?: string;
  blockRange?: {
    from: number;
    to?: number;
  };
  rateLimit?: number;
  typesBundle?: Parameters<SubstrateBatchProcessor<any>['setTypesBundle']>[0];
};

export class Processor {
  processor: SubstrateBatchProcessor<typeof fields>;
  database: TypeormDatabaseWithCache;
  constructor(db: TypeormDatabaseWithCache, config: ProcessorConfig) {
    config.gateway = lookupArchive(config.chain, { release: 'ArrowSquid' });

    this.database = db;
    this.processor = new SubstrateBatchProcessor().setFields(fields).setGateway(config.gateway).setRpcEndpoint(config.endpoint);

    if (config.blockRange) {
      this.processor.setBlockRange(config.blockRange);
    }

    if (config.typesBundle) {
      this.processor.setTypesBundle(config.typesBundle);
    }
  }

  addEvents(events: string[]) {
    this.processor.addEvent({
      name: events,
    });
  }

  addCalls(calls: string[]) {
    this.processor.addCall({
      name: calls,
    });
  }

  start(callback: (ctx: any) => Promise<void>) {
    this.processor.run(this.database, async (ctx) => {
      await callback(ctx);
    });
  }
}
export type Fields = SubstrateBatchProcessorFields<typeof fields>;
export type Block = _Block<Fields>;
export type BlockHeader = _BlockHeader<Fields>;
export type Event = _Event<Fields>;
export type Call = _Call<Fields>;
export type Extrinsic = _Extrinsic<Fields>;
export type ProcessorContext = DataHandlerContext<StoreWithCache, Fields>;
