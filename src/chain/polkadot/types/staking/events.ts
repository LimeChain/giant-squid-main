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
