import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v0 from '../v0'
import * as v9090 from '../v9090'
import * as v9300 from '../v9300'
import * as v1001002 from '../v1001002'

export const reward =  {
    name: 'Staking.Reward',
    /**
     *  The staker has been rewarded by this amount. `AccountId` is the stash account.
     */
    v0: new EventType(
        'Staking.Reward',
        sts.tuple([v0.AccountId, v0.Balance])
    ),
}

export const slash =  {
    name: 'Staking.Slash',
    /**
     *  One validator (and its nominators) has been slashed by the given amount.
     */
    v0: new EventType(
        'Staking.Slash',
        sts.tuple([v0.AccountId, v0.Balance])
    ),
}

export const bonded =  {
    name: 'Staking.Bonded',
    /**
     *  An account has bonded this amount.
     * 
     *  NOTE: This event is only emitted when funds are bonded via a dispatchable. Notably,
     *  it will not be emitted for staking rewards when they are added to stake.
     */
    v0: new EventType(
        'Staking.Bonded',
        sts.tuple([v0.AccountId, v0.Balance])
    ),
    /**
     * An account has bonded this amount. \[stash, amount\]
     * 
     * NOTE: This event is only emitted when funds are bonded via a dispatchable. Notably,
     * it will not be emitted for staking rewards when they are added to stake.
     */
    v9300: new EventType(
        'Staking.Bonded',
        sts.struct({
            stash: v9300.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const unbonded =  {
    name: 'Staking.Unbonded',
    /**
     *  An account has unbonded this amount.
     */
    v0: new EventType(
        'Staking.Unbonded',
        sts.tuple([v0.AccountId, v0.Balance])
    ),
    /**
     * An account has unbonded this amount.
     */
    v9300: new EventType(
        'Staking.Unbonded',
        sts.struct({
            stash: v9300.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const withdrawn =  {
    name: 'Staking.Withdrawn',
    /**
     *  An account has called `withdraw_unbonded` and removed unbonding chunks worth `Balance`
     *  from the unlocking queue.
     */
    v0: new EventType(
        'Staking.Withdrawn',
        sts.tuple([v0.AccountId, v0.Balance])
    ),
    /**
     * An account has called `withdraw_unbonded` and removed unbonding chunks worth `Balance`
     * from the unlocking queue.
     */
    v9300: new EventType(
        'Staking.Withdrawn',
        sts.struct({
            stash: v9300.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const rewarded =  {
    name: 'Staking.Rewarded',
    /**
     *  The nominator has been rewarded by this amount. \[stash, amount\]
     */
    v9090: new EventType(
        'Staking.Rewarded',
        sts.tuple([v9090.AccountId, v9090.Balance])
    ),
    /**
     * The nominator has been rewarded by this amount.
     */
    v9300: new EventType(
        'Staking.Rewarded',
        sts.struct({
            stash: v9300.AccountId32,
            amount: sts.bigint(),
        })
    ),
    /**
     * The nominator has been rewarded by this amount to this destination.
     */
    v1001002: new EventType(
        'Staking.Rewarded',
        sts.struct({
            stash: v1001002.AccountId32,
            dest: v1001002.RewardDestination,
            amount: sts.bigint(),
        })
    ),
}

export const slashed =  {
    name: 'Staking.Slashed',
    /**
     *  One validator (and its nominators) has been slashed by the given amount.
     *  \[validator, amount\]
     */
    v9090: new EventType(
        'Staking.Slashed',
        sts.tuple([v9090.AccountId, v9090.Balance])
    ),
    /**
     * One staker (and potentially its nominators) has been slashed by the given amount.
     */
    v9300: new EventType(
        'Staking.Slashed',
        sts.struct({
            staker: v9300.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
