import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1 from '../v1'
import * as v2 from '../v2'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded. \[from, to, value\]
     */
    v1: new EventType(
        'Balances.Transfer',
        sts.tuple([v1.AccountId32, v1.AccountId32, sts.bigint()])
    ),
    /**
     * Transfer succeeded.
     */
    v2: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v2.AccountId32,
            to: v2.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
