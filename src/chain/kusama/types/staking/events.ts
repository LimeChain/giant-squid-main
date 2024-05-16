import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1020 from '../v1020'
import * as v1050 from '../v1050'
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
