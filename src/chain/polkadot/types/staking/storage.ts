import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v0 from '../v0'

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
