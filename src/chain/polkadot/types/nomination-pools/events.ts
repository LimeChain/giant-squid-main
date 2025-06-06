import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v9280 from '../v9280'

export const bonded =  {
    name: 'NominationPools.Bonded',
    /**
     * A member has became bonded in a pool.
     */
    v9280: new EventType(
        'NominationPools.Bonded',
        sts.struct({
            member: v9280.AccountId32,
            poolId: sts.number(),
            bonded: sts.bigint(),
            joined: sts.boolean(),
        })
    ),
}

export const paidOut =  {
    name: 'NominationPools.PaidOut',
    /**
     * A payout has been made to a member.
     */
    v9280: new EventType(
        'NominationPools.PaidOut',
        sts.struct({
            member: v9280.AccountId32,
            poolId: sts.number(),
            payout: sts.bigint(),
        })
    ),
}

export const unbonded =  {
    name: 'NominationPools.Unbonded',
    /**
     * A member has unbonded from their pool.
     * 
     * - `balance` is the corresponding balance of the number of points that has been
     *   requested to be unbonded (the argument of the `unbond` transaction) from the bonded
     *   pool.
     * - `points` is the number of points that are issued as a result of `balance` being
     * dissolved into the corresponding unbonding pool.
     * - `era` is the era in which the balance will be unbonded.
     * In the absence of slashing, these values will match. In the presence of slashing, the
     * number of points that are issued in the unbonding pool will be less than the amount
     * requested to be unbonded.
     */
    v9280: new EventType(
        'NominationPools.Unbonded',
        sts.struct({
            member: v9280.AccountId32,
            poolId: sts.number(),
            balance: sts.bigint(),
            points: sts.bigint(),
            era: sts.number(),
        })
    ),
}

export const withdrawn =  {
    name: 'NominationPools.Withdrawn',
    /**
     * A member has withdrawn from their pool.
     * 
     * The given number of `points` have been dissolved in return of `balance`.
     * 
     * Similar to `Unbonded` event, in the absence of slashing, the ratio of point to balance
     * will be 1.
     */
    v9280: new EventType(
        'NominationPools.Withdrawn',
        sts.struct({
            member: v9280.AccountId32,
            poolId: sts.number(),
            balance: sts.bigint(),
            points: sts.bigint(),
        })
    ),
}

export const destroyed =  {
    name: 'NominationPools.Destroyed',
    /**
     * A pool has been destroyed.
     */
    v9280: new EventType(
        'NominationPools.Destroyed',
        sts.struct({
            poolId: sts.number(),
        })
    ),
}

export const stateChanged =  {
    name: 'NominationPools.StateChanged',
    /**
     * The state of a pool has changed
     */
    v9280: new EventType(
        'NominationPools.StateChanged',
        sts.struct({
            poolId: sts.number(),
            newState: v9280.PoolState,
        })
    ),
}
