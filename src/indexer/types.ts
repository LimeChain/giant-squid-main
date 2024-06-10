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

export type IndexerParams = {
  config: {
    chain: string;
    endpoint: Parameters<SubstrateBatchProcessor<any>['setRpcEndpoint']>[0];
    gateway?: string;
    blockRange?: {
      from: number;
      to?: number;
    };
    typesBundle?: {
      specVersion: number;
      types: any;
    };
  };
  decoders: DecodersMap;
};
