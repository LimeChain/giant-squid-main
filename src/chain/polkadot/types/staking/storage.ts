import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v0 from '../v0'
import * as v1002000 from '../v1002000'

export const ledger =  {
    /**
     *  Map from all (unlocked) "controller" accounts to the info regarding the staking.
     */
    v0: new StorageType('Staking.Ledger', 'Optional', [v0.AccountId], v0.StakingLedger) as LedgerV0,
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
export interface LedgerV0  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v0.AccountId): Promise<(v0.StakingLedger | undefined)>
    getMany(block: Block, keys: v0.AccountId[]): Promise<(v0.StakingLedger | undefined)[]>
    getKeys(block: Block): Promise<v0.AccountId[]>
    getKeys(block: Block, key: v0.AccountId): Promise<v0.AccountId[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v0.AccountId[]>
    getKeysPaged(pageSize: number, block: Block, key: v0.AccountId): AsyncIterable<v0.AccountId[]>
    getPairs(block: Block): Promise<[k: v0.AccountId, v: (v0.StakingLedger | undefined)][]>
    getPairs(block: Block, key: v0.AccountId): Promise<[k: v0.AccountId, v: (v0.StakingLedger | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v0.AccountId, v: (v0.StakingLedger | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v0.AccountId): AsyncIterable<[k: v0.AccountId, v: (v0.StakingLedger | undefined)][]>
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
     * 
     *  This is the latest planned era, depending on how the Session pallet queues the validator
     *  set, it might be active or not.
     */
    v0: new StorageType('Staking.CurrentEra', 'Optional', [], v0.EraIndex) as CurrentEraV0,
}

/**
 *  The current era index.
 * 
 *  This is the latest planned era, depending on how the Session pallet queues the validator
 *  set, it might be active or not.
 */
export interface CurrentEraV0  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v0.EraIndex | undefined)>
}
