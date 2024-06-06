import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v900 from '../v900'
import * as v1201 from '../v1201'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded. \[from, to, value\]
     */
    v900: new EventType(
        'Balances.Transfer',
        sts.tuple([v900.H160, v900.H160, sts.bigint()])
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
