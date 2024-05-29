import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v9000 from '../v9000'
import * as v9071 from '../v9071'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded. \[from, to, value\]
     */
    v9000: new EventType(
        'Balances.Transfer',
        sts.tuple([v9000.AccountId32, v9000.AccountId32, sts.bigint()])
    ),
    /**
     * Transfer succeeded.
     */
    v9071: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v9071.AccountId32,
            to: v9071.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
