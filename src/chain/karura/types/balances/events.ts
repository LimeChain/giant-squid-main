import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1000 from '../v1000'
import * as v2010 from '../v2010'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     *  Transfer succeeded. \[from, to, value\]
     */
    v1000: new EventType(
        'Balances.Transfer',
        sts.tuple([v1000.AccountId, v1000.AccountId, v1000.Balance])
    ),
    /**
     * Transfer succeeded.
     */
    v2010: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v2010.AccountId32,
            to: v2010.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
