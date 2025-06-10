import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v601 from '../v601'
import * as v700 from '../v700'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded. \[from, to, value\]
     */
    v601: new EventType(
        'Balances.Transfer',
        sts.tuple([v601.AccountId32, v601.AccountId32, sts.bigint()])
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
