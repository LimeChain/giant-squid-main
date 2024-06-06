import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1000 from '../v1000'
import * as v1002 from '../v1002'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded. \[from, to, value\]
     */
    v1000: new EventType(
        'Balances.Transfer',
        sts.tuple([v1000.AccountId32, v1000.AccountId32, sts.bigint()])
    ),
    /**
     * Transfer succeeded.
     */
    v1002: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v1002.AccountId32,
            to: v1002.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
