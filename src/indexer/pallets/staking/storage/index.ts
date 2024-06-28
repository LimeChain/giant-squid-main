import { ILedgerData, IStoragePalletLoader } from './../../../types';

export interface ICurrentEraStorageLoader extends IStoragePalletLoader<number | undefined> {}
export interface ILedgerStorageLoader extends IStoragePalletLoader<ILedgerData | undefined> {}
