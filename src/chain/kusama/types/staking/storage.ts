import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v1020 from '../v1020'
import * as v1050 from '../v1050'
import * as v1058 from '../v1058'
import * as v1002000 from '../v1002000'

export const ledger =  {
    /**
     *  Map from all (unlocked) "controller" accounts to the info regarding the staking.
     */
    v1020: new StorageType('Staking.Ledger', 'Optional', [v1020.AccountId], v1020.StakingLedger) as LedgerV1020,
    /**
     *  Map from all (unlocked) "controller" accounts to the info regarding the staking.
     */
    v1050: new StorageType('Staking.Ledger', 'Optional', [v1050.AccountId], v1050.StakingLedger) as LedgerV1050,
    /**
     *  Map from all (unlocked) "controller" accounts to the info regarding the staking.
     */
    v1058: new StorageType('Staking.Ledger', 'Optional', [v1058.AccountId], v1058.StakingLedger) as LedgerV1058,
    /**
     *  Map from all (unlocked) "controller" accounts to the info regarding the staking.
     * 
     *  Note: All the reads and mutations to this storage *MUST* be done through the methods exposed
     *  by [`StakingLedger`] to ensure data and lock consistency.
     */
    v1002000: new StorageType('Staking.Ledger', 'Optional', [v1002000.AccountId32], v1002000.StakingLedger) as LedgerV1002000,
}

/**
 *  Map from all (unlocked) "controller" accounts to the info regarding the staking.
 */
export interface LedgerV1020  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v1020.AccountId): Promise<(v1020.StakingLedger | undefined)>
    getMany(block: Block, keys: v1020.AccountId[]): Promise<(v1020.StakingLedger | undefined)[]>
}

/**
 *  Map from all (unlocked) "controller" accounts to the info regarding the staking.
 */
export interface LedgerV1050  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v1050.AccountId): Promise<(v1050.StakingLedger | undefined)>
    getMany(block: Block, keys: v1050.AccountId[]): Promise<(v1050.StakingLedger | undefined)[]>
}

/**
 *  Map from all (unlocked) "controller" accounts to the info regarding the staking.
 */
export interface LedgerV1058  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v1058.AccountId): Promise<(v1058.StakingLedger | undefined)>
    getMany(block: Block, keys: v1058.AccountId[]): Promise<(v1058.StakingLedger | undefined)[]>
    getKeys(block: Block): Promise<v1058.AccountId[]>
    getKeys(block: Block, key: v1058.AccountId): Promise<v1058.AccountId[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v1058.AccountId[]>
    getKeysPaged(pageSize: number, block: Block, key: v1058.AccountId): AsyncIterable<v1058.AccountId[]>
    getPairs(block: Block): Promise<[k: v1058.AccountId, v: (v1058.StakingLedger | undefined)][]>
    getPairs(block: Block, key: v1058.AccountId): Promise<[k: v1058.AccountId, v: (v1058.StakingLedger | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v1058.AccountId, v: (v1058.StakingLedger | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v1058.AccountId): AsyncIterable<[k: v1058.AccountId, v: (v1058.StakingLedger | undefined)][]>
}

/**
 *  Map from all (unlocked) "controller" accounts to the info regarding the staking.
 * 
 *  Note: All the reads and mutations to this storage *MUST* be done through the methods exposed
 *  by [`StakingLedger`] to ensure data and lock consistency.
 */
export interface LedgerV1002000  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v1002000.AccountId32): Promise<(v1002000.StakingLedger | undefined)>
    getMany(block: Block, keys: v1002000.AccountId32[]): Promise<(v1002000.StakingLedger | undefined)[]>
    getKeys(block: Block): Promise<v1002000.AccountId32[]>
    getKeys(block: Block, key: v1002000.AccountId32): Promise<v1002000.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v1002000.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v1002000.AccountId32): AsyncIterable<v1002000.AccountId32[]>
    getPairs(block: Block): Promise<[k: v1002000.AccountId32, v: (v1002000.StakingLedger | undefined)][]>
    getPairs(block: Block, key: v1002000.AccountId32): Promise<[k: v1002000.AccountId32, v: (v1002000.StakingLedger | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v1002000.AccountId32, v: (v1002000.StakingLedger | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v1002000.AccountId32): AsyncIterable<[k: v1002000.AccountId32, v: (v1002000.StakingLedger | undefined)][]>
}

export const currentEra =  {
    /**
     *  The current era index.
     */
    v1020: new StorageType('Staking.CurrentEra', 'Default', [], v1020.EraIndex) as CurrentEraV1020,
    /**
     *  The current era index.
     * 
     *  This is the latest planned era, depending on how session module queues the validator
     *  set, it might be active or not.
     */
    v1050: new StorageType('Staking.CurrentEra', 'Optional', [], v1050.EraIndex) as CurrentEraV1050,
}

/**
 *  The current era index.
 */
export interface CurrentEraV1020  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v1020.EraIndex
    get(block: Block): Promise<(v1020.EraIndex | undefined)>
}

/**
 *  The current era index.
 * 
 *  This is the latest planned era, depending on how session module queues the validator
 *  set, it might be active or not.
 */
export interface CurrentEraV1050  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v1050.EraIndex | undefined)>
}
