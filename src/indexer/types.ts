import { PalletSetups } from '@/indexer/registry';
import { BlockHeader, Call, Event, ProcessorConfig } from '@/indexer/processor';

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

export interface IConstantPalletGetter<T> {
  get(blockHeader: BlockHeader): T;
}

export interface IStoragePalletLoader<T> {
  load(blockHeader: BlockHeader, ...params: unknown[]): Promise<T>;
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
