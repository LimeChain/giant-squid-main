import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v16 from '../v16'
import * as v38 from '../v38'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     *  Transfer succeeded. \[from, to, value\]
     */
    v16: new EventType(
        'Balances.Transfer',
        sts.tuple([v16.AccountId, v16.AccountId, v16.Balance])
    ),
    /**
     * Transfer succeeded.
     */
    v38: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v38.AccountId32,
            to: v38.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
