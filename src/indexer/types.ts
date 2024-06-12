import { SubstrateBatchProcessor } from '@subsquid/substrate-processor';
import { Call, Event } from '../processor';
import { PalletCallHandler, PalletEventHandler } from './handler';
import { DecodersMap } from './mapper';

export interface PalletEventDecoder<T> {
  decode(event: Event): T;
}

export interface PalletCallDecoder<T> {
  decode(call: Call): T;
}

export type PalletEvent<Dto> = {
  decoder: PalletEventDecoder<Dto>;
  handler: PalletEventHandler<PalletEventDecoder<Dto>>;
};

export type PalletCall<Dto> = {
  decoder: PalletCallDecoder<Dto>;
  handler: PalletCallHandler<PalletCallDecoder<Dto>>;
};

export type WrappedData = {
  __kind: string;
  value?: string;
};

export type IdentityInfo = {
  web: WrappedData;
  display: WrappedData;
  legal: WrappedData;
  email: WrappedData;
  image: WrappedData;
  pgpFingerprint: string;
  riot: WrappedData;
  twitter: WrappedData;
  additional: any;
};

export type IndexerParams = {
  config: {
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
  decoders: DecodersMap;
};

// export interface IChainData {
//   prefix?: number;
//   network: string;
//   displayName: string;
//   symbols: string[];
//   decimals: string[];
//   archiveName: string;
// }
