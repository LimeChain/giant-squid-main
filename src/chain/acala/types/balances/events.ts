import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v2000 from '../v2000'
import * as v2011 from '../v2011'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded. \[from, to, value\]
     */
    v2000: new EventType(
        'Balances.Transfer',
        sts.tuple([v2000.AccountId32, v2000.AccountId32, sts.bigint()])
    ),
    /**
     * Transfer succeeded.
     */
    v2011: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v2011.AccountId32,
            to: v2011.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
