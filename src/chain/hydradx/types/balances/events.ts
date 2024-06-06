import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v100 from '../v100'
import * as v104 from '../v104'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded. \[from, to, value\]
     */
    v100: new EventType(
        'Balances.Transfer',
        sts.tuple([v100.AccountId32, v100.AccountId32, sts.bigint()])
    ),
    /**
     * Transfer succeeded.
     */
    v104: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v104.AccountId32,
            to: v104.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
