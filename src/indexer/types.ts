import { PalletSetups } from './registry';
import { Call, Event, ProcessorConfig } from './processor';

export type IBasePalletSetup = {
  decoder: {
    decode(item: Event | Call): unknown;
  };
};

export interface IEventPalletDecoder<T> {
  decode(event: Event): T;
}

export interface ICallPalletDecoder<T> {
  decode(call: Call): T;
}

export type WrappedData = {
  __kind: string;
  value?: string;
};

export type JudgementData = {
  __kind: string;
};

export type IdentityInfoData = {
  additional?: any;
  display: WrappedData;
  legal: WrappedData;
  web: WrappedData;
  riot: WrappedData;
  email: WrappedData;
  pgpFingerprint?: string;
  image: WrappedData;
  twitter: WrappedData;
};

export type IndexerParams = {
  config: ProcessorConfig;
  pallets: PalletSetups;
};

// export interface IChainData {
//   prefix?: number;
//   network: string;
//   displayName: string;
//   symbols: string[];
//   decimals: string[];
//   archiveName: string;
// }
