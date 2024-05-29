import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1 from '../v1'
import * as v1090 from '../v1090'

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
    v1090: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v1090.AccountId32,
            to: v1090.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
