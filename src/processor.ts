import {
  Event as _Event,
  Call as _Call,
  Extrinsic as _Extrinsic,
  Block as _Block,
  BlockHeader as _BlockHeader,
  DataHandlerContext,
  SubstrateBatchProcessor,
  SubstrateBatchProcessorFields,
} from '@subsquid/substrate-processor';
import { chain } from './chain';

export const processor = new SubstrateBatchProcessor()
  .setGateway(chain.config.gateway)
  .setRpcEndpoint(chain.config.endpoint)
  .setFields({
    block: {
      timestamp: true,
    },
    call: {
      name: true,
      args: true,
      origin: true,
      success: true,
    },
    event: {
      name: true,
      args: true,
    },
    extrinsic: {
      hash: true,
      success: true,
    },
  })
  .addEvent({
    name: [
      'Balances.Transfer',
      'Staking.Reward',
      'Staking.Rewarded',
      'Identity.SubIdentityRemoved',
      'Identity.SubIdentityRevoked',
    ],
    call: true,
    extrinsic: true,
  })
  .addCall({
    name: [
      'Identity.set_identity',
      'Identity.provide_judgement',
      'Identity.set_subs',
      'Identity.rename_sub',
      'Identity.add_sub',
      'Identity.clear_identity',
      'Identity.kill_identity',
    ],
    extrinsic: true,
  });

if (chain.config.blockRange) processor.setBlockRange(chain.config.blockRange);
if (chain.config.typesBundle) processor.setTypesBundle(chain.config.typesBundle);

export type Fields = SubstrateBatchProcessorFields<typeof processor>;
export type Block = _Block<Fields>;
export type BlockHeader = _BlockHeader<Fields>;
export type Event = _Event<Fields>;
export type Call = _Call<Fields>;
export type Extrinsic = _Extrinsic<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
