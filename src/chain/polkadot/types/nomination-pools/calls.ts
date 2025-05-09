import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v9280 from '../v9280'
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
    v9280: new CallType(
        'NominationPools.create',
        sts.struct({
            amount: sts.bigint(),
            root: v9280.AccountId32,
            nominator: v9280.AccountId32,
            stateToggler: v9280.AccountId32,
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
    /**
     * Nominate on behalf of the pool.
     * 
     * The dispatch origin of this call must be signed by the pool nominator or the pool
     * root role.
     * 
     * This directly forward the call to the staking pallet, on behalf of the pool bonded
     * account.
     */
    v9280: new CallType(
        'NominationPools.nominate',
        sts.struct({
            poolId: sts.number(),
            validators: sts.array(() => v9280.AccountId32),
        })
    ),
}

export const setMetadata =  {
    name: 'NominationPools.set_metadata',
    /**
     * Set a new metadata for the pool.
     * 
     * The dispatch origin of this call must be signed by the state toggler, or the root role
     * of the pool.
     */
    v9280: new CallType(
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
    v9280: new CallType(
        'NominationPools.update_roles',
        sts.struct({
            poolId: sts.number(),
            newRoot: v9280.Type_372,
            newNominator: v9280.Type_372,
            newStateToggler: v9280.Type_372,
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
            newRoot: v9420.Type_302,
            newNominator: v9420.Type_302,
            newBouncer: v9420.Type_302,
        })
    ),
}
