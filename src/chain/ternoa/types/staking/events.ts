import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1 from '../v1'
import * as v11 from '../v11'

export const rewarded =  {
    name: 'Staking.Rewarded',
    /**
     * The nominator has been rewarded by this amount. \[stash, amount\]
     */
    v1: new EventType(
        'Staking.Rewarded',
        sts.tuple([v1.AccountId32, sts.bigint()])
    ),
    /**
     * The nominator has been rewarded by this amount.
     */
    v11: new EventType(
        'Staking.Rewarded',
        sts.struct({
            stash: v11.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
