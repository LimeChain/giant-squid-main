import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v5 from '../v5'
import * as v8 from '../v8'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded. \[from, to, value\]
     */
    v5: new EventType(
        'Balances.Transfer',
        sts.tuple([v5.AccountId32, v5.AccountId32, sts.bigint()])
    ),
    /**
     * Transfer succeeded.
     */
    v8: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v8.AccountId32,
            to: v8.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
