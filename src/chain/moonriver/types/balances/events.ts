import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v49 from '../v49'
import * as v1201 from '../v1201'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     *  Transfer succeeded. \[from, to, value\]
     */
    v49: new EventType(
        'Balances.Transfer',
        sts.tuple([v49.AccountId, v49.AccountId, v49.Balance])
    ),
    /**
     * Transfer succeeded.
     */
    v1201: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v1201.AccountId20,
            to: v1201.AccountId20,
            amount: sts.bigint(),
        })
    ),
}
