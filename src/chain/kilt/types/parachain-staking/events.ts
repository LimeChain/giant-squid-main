import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v21 from '../v21'

export const rewarded =  {
    name: 'ParachainStaking.Rewarded',
    /**
     *  A collator or a delegator has received a reward.
     *  \[account, amount of reward\]
     */
    v21: new EventType(
        'ParachainStaking.Rewarded',
        sts.tuple([v21.AccountId, v21.BalanceOf])
    ),
}
