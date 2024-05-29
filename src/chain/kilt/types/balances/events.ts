import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v21 from '../v21'
import * as v10400 from '../v10400'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     *  Transfer succeeded. \[from, to, value\]
     */
    v21: new EventType(
        'Balances.Transfer',
        sts.tuple([v21.AccountId, v21.AccountId, v21.Balance])
    ),
    /**
     * Transfer succeeded.
     */
    v10400: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v10400.AccountId32,
            to: v10400.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
