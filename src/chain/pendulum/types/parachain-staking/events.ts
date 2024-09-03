import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1 from '../v1'

export const rewarded =  {
    name: 'ParachainStaking.Rewarded',
    /**
     * A collator or a delegator has received a reward.
     * \[account, amount of reward\]
     */
    v1: new EventType(
        'ParachainStaking.Rewarded',
        sts.tuple([v1.AccountId32, sts.bigint()])
    ),
}
