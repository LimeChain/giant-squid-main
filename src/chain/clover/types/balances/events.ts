import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v10 from '../v10'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     *  Transfer succeeded. \[from, to, value\]
     */
    v10: new EventType(
        'Balances.Transfer',
        sts.tuple([v10.AccountId, v10.AccountId, v10.Balance])
    ),
}
