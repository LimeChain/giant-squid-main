import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v26 from '../v26'
import * as v34 from '../v34'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     *  Transfer succeeded. \[from, to, value\]
     */
    v26: new EventType(
        'Balances.Transfer',
        sts.tuple([v26.AccountId, v26.AccountId, v26.Balance])
    ),
    /**
     * Transfer succeeded.
     */
    v34: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v34.AccountId32,
            to: v34.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
