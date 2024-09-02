import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1020 from '../v1020'
import * as v1050 from '../v1050'
import * as v1051 from '../v1051'
import * as v9090 from '../v9090'
import * as v9300 from '../v9300'
import * as v1001000 from '../v1001000'

export const reward =  {
    name: 'Staking.Reward',
    /**
     *  All validators have been rewarded by the first balance; the second is the remainder
     *  from the maximum amount of reward.
     */
    v1020: new EventType(
        'Staking.Reward',
        sts.tuple([v1020.Balance, v1020.Balance])
    ),
    /**
     *  The staker has been rewarded by this amount. AccountId is controller account.
     */
    v1050: new EventType(
        'Staking.Reward',
        sts.tuple([v1050.AccountId, v1050.Balance])
    ),
}

export const slash =  {
    name: 'Staking.Slash',
    /**
     *  One validator (and its nominators) has been slashed by the given amount.
     */
    v1020: new EventType(
        'Staking.Slash',
        sts.tuple([v1020.AccountId, v1020.Balance])
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
    v1051: new EventType(
        'Staking.Bonded',
        sts.tuple([v1051.AccountId, v1051.Balance])
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
    v1051: new EventType(
        'Staking.Unbonded',
        sts.tuple([v1051.AccountId, v1051.Balance])
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
    v1051: new EventType(
        'Staking.Withdrawn',
        sts.tuple([v1051.AccountId, v1051.Balance])
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
    v1001000: new EventType(
        'Staking.Rewarded',
        sts.struct({
            stash: v1001000.AccountId32,
            dest: v1001000.RewardDestination,
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
