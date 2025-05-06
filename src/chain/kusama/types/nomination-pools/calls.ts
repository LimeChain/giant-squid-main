import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v9220 from '../v9220'
import * as v9230 from '../v9230'
import * as v9291 from '../v9291'
import * as v9420 from '../v9420'

export const create =  {
    name: 'NominationPools.create',
    /**
     * Create a new delegation pool.
     * 
     * # Arguments
     * 
     * * `amount` - The amount of funds to delegate to the pool. This also acts of a sort of
     *   deposit since the pools creator cannot fully unbond funds until the pool is being
     *   destroyed.
     * * `index` - A disambiguation index for creating the account. Likely only useful when
     *   creating multiple pools in the same extrinsic.
     * * `root` - The account to set as [`PoolRoles::root`].
     * * `nominator` - The account to set as the [`PoolRoles::nominator`].
     * * `state_toggler` - The account to set as the [`PoolRoles::state_toggler`].
     * 
     * # Note
     * 
     * In addition to `amount`, the caller will transfer the existential deposit; so the caller
     * needs at have at least `amount + existential_deposit` transferrable.
     */
    v9220: new CallType(
        'NominationPools.create',
        sts.struct({
            amount: sts.bigint(),
            root: v9220.AccountId32,
            nominator: v9220.AccountId32,
            stateToggler: v9220.AccountId32,
        })
    ),
    /**
     * Create a new delegation pool.
     * 
     * # Arguments
     * 
     * * `amount` - The amount of funds to delegate to the pool. This also acts of a sort of
     *   deposit since the pools creator cannot fully unbond funds until the pool is being
     *   destroyed.
     * * `index` - A disambiguation index for creating the account. Likely only useful when
     *   creating multiple pools in the same extrinsic.
     * * `root` - The account to set as [`PoolRoles::root`].
     * * `nominator` - The account to set as the [`PoolRoles::nominator`].
     * * `state_toggler` - The account to set as the [`PoolRoles::state_toggler`].
     * 
     * # Note
     * 
     * In addition to `amount`, the caller will transfer the existential deposit; so the caller
     * needs at have at least `amount + existential_deposit` transferrable.
     */
    v9291: new CallType(
        'NominationPools.create',
        sts.struct({
            amount: sts.bigint(),
            root: v9291.MultiAddress,
            nominator: v9291.MultiAddress,
            stateToggler: v9291.MultiAddress,
        })
    ),
    /**
     * Create a new delegation pool.
     * 
     * # Arguments
     * 
     * * `amount` - The amount of funds to delegate to the pool. This also acts of a sort of
     *   deposit since the pools creator cannot fully unbond funds until the pool is being
     *   destroyed.
     * * `index` - A disambiguation index for creating the account. Likely only useful when
     *   creating multiple pools in the same extrinsic.
     * * `root` - The account to set as [`PoolRoles::root`].
     * * `nominator` - The account to set as the [`PoolRoles::nominator`].
     * * `bouncer` - The account to set as the [`PoolRoles::bouncer`].
     * 
     * # Note
     * 
     * In addition to `amount`, the caller will transfer the existential deposit; so the caller
     * needs at have at least `amount + existential_deposit` transferrable.
     */
    v9420: new CallType(
        'NominationPools.create',
        sts.struct({
            amount: sts.bigint(),
            root: v9420.MultiAddress,
            nominator: v9420.MultiAddress,
            bouncer: v9420.MultiAddress,
        })
    ),
}

export const nominate =  {
    name: 'NominationPools.nominate',
    v9220: new CallType(
        'NominationPools.nominate',
        sts.struct({
            poolId: sts.number(),
            validators: sts.array(() => v9220.AccountId32),
        })
    ),
}

export const setMetadata =  {
    name: 'NominationPools.set_metadata',
    v9220: new CallType(
        'NominationPools.set_metadata',
        sts.struct({
            poolId: sts.number(),
            metadata: sts.bytes(),
        })
    ),
}

export const updateRoles =  {
    name: 'NominationPools.update_roles',
    /**
     * Update the roles of the pool.
     * 
     * The root is the only entity that can change any of the roles, including itself,
     * excluding the depositor, who can never change.
     * 
     * It emits an event, notifying UIs of the role change. This event is quite relevant to
     * most pool members and they should be informed of changes to pool roles.
     */
    v9220: new CallType(
        'NominationPools.update_roles',
        sts.struct({
            poolId: sts.number(),
            root: sts.option(() => v9220.AccountId32),
            nominator: sts.option(() => v9220.AccountId32),
            stateToggler: sts.option(() => v9220.AccountId32),
        })
    ),
    /**
     * Update the roles of the pool.
     * 
     * The root is the only entity that can change any of the roles, including itself,
     * excluding the depositor, who can never change.
     * 
     * It emits an event, notifying UIs of the role change. This event is quite relevant to
     * most pool members and they should be informed of changes to pool roles.
     */
    v9230: new CallType(
        'NominationPools.update_roles',
        sts.struct({
            poolId: sts.number(),
            newRoot: v9230.Type_487,
            newNominator: v9230.Type_487,
            newStateToggler: v9230.Type_487,
        })
    ),
    /**
     * Update the roles of the pool.
     * 
     * The root is the only entity that can change any of the roles, including itself,
     * excluding the depositor, who can never change.
     * 
     * It emits an event, notifying UIs of the role change. This event is quite relevant to
     * most pool members and they should be informed of changes to pool roles.
     */
    v9420: new CallType(
        'NominationPools.update_roles',
        sts.struct({
            poolId: sts.number(),
            newRoot: v9420.Type_312,
            newNominator: v9420.Type_312,
            newBouncer: v9420.Type_312,
        })
    ),
}
