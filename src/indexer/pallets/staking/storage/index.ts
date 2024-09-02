import { IStoragePalletLoader } from '@/indexer/types';

export interface ICurrentEraStorageLoader extends IStoragePalletLoader<number | undefined> {}

export interface ILedgerStorageLoader extends IStoragePalletLoader<{ stash: string } | undefined> {}
