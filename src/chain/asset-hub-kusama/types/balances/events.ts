import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1 from '../v1'
import * as v700 from '../v700'

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
    v700: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v700.AccountId32,
            to: v700.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
