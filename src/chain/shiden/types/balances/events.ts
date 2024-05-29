import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1 from '../v1'
import * as v36 from '../v36'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     *  Transfer succeeded. \[from, to, value\]
     */
    v1: new EventType(
        'Balances.Transfer',
        sts.tuple([v1.AccountId, v1.AccountId, v1.Balance])
    ),
    /**
     * Transfer succeeded.
     */
    v36: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v36.AccountId32,
            to: v36.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
