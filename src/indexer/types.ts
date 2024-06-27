import { PalletSetups } from './registry';
import { BlockHeader, Call, Event, ProcessorConfig, ProcessorContext } from './processor';

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

type ConstantType<T> = {
  new (block: BlockHeader): {
    readonly value: T;
  };
};

type StorageType<K extends any[], V> = {
  new (
    ctx: ProcessorContext,
    block: BlockHeader,
    ...keys: K
  ): {
    readonly value: Promise<V>;
  };
};

type CurrentEraStorageType = StorageType<[], number | undefined>;

export type ConstantTypes = {
  bookingDuration: ConstantType<number>;
  currentEra: CurrentEraStorageType;
};
