import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v268 from '../v268'
import * as v274 from '../v274'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     *  Transfer succeeded. \[from, to, value\]
     */
    v268: new EventType(
        'Balances.Transfer',
        sts.tuple([v268.AccountId, v268.AccountId, v268.Balance])
    ),
    /**
     * Transfer succeeded.
     */
    v274: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v274.AccountId32,
            to: v274.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
