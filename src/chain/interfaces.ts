import type { SubstrateBatchProcessor } from '@subsquid/substrate-processor';

import type acala from './acala/api';
import type astar from './astar/api';
import type amplitude from './amplitude/api';
import type basilisk from './basilisk/api';
import type bifrostPolkadot from './bifrost-polkadot/api';
import type centrifuge from './centrifuge/api';
import type clover from './clover/api';
import type darwinia from './darwinia/api';
import type integritee from './integritee/api';
import type kilt from './kilt/api';
import type litentry from './litentry/api';
import type litmus from './litmus/api';
import type pendulum from './pendulum/api';
import type picasso from './picasso/api';
import type robonomics from './robonomics/api';
import type ternoa from './ternoa/api';
import type turing from './turing/api';
import type zeitgeist from './zeitgeist/api';
import type hydradx from './hydradx/api';
import type karura from './karura/api';
import type khala from './khala/api';
import type kusama from './kusama/api';
import type moonbeam from './moonbeam/api';
import type moonriver from './moonriver/api';
import type phala from './phala/api';
import type polkadot from './polkadot/api';
import type shiden from './shiden/api';
import type subsocial from './subsocial-parachain/api';
import type darwiniaCrab from './darwinia-crab/api';

export type ChainApi =
  | typeof acala
  | typeof astar
  | typeof amplitude
  | typeof basilisk
  | typeof bifrostPolkadot
  | typeof centrifuge
  | typeof clover
  | typeof darwinia
  | typeof integritee
  | typeof kilt
  | typeof litentry
  | typeof litmus
  | typeof pendulum
  | typeof picasso
  | typeof robonomics
  | typeof ternoa
  | typeof turing
  | typeof zeitgeist
  | typeof hydradx
  | typeof karura
  | typeof khala
  | typeof kusama
  | typeof moonbeam
  | typeof moonriver
  | typeof phala
  | typeof polkadot
  | typeof shiden
  | typeof subsocial
  | typeof darwiniaCrab;

export interface ProcessorConfig {
  name: string;
  gateway: Parameters<SubstrateBatchProcessor<any>['setGateway']>[0];
  endpoint: Parameters<SubstrateBatchProcessor<any>['setRpcEndpoint']>[0];
  prefix?: number;
  blockRange?: Parameters<SubstrateBatchProcessor<any>['setBlockRange']>[0];
  typesBundle?: Parameters<SubstrateBatchProcessor<any>['setTypesBundle']>[0];
}

export interface IChainData {
  prefix?: number;
  network: string;
  displayName: string;
  symbols: string[];
  decimals: string[];
  archiveName: string;
}
