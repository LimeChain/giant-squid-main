import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v268 from '../v268'
import * as v283 from '../v283'

export const rewarded =  {
    name: 'Staking.Rewarded',
    /**
     *  The nominator has been rewarded by this amount. \[stash, amount\]
     */
    v268: new EventType(
        'Staking.Rewarded',
        sts.tuple([v268.AccountId, v268.Balance])
    ),
    /**
     * The nominator has been rewarded by this amount.
     */
    v283: new EventType(
        'Staking.Rewarded',
        sts.struct({
            stash: v283.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
