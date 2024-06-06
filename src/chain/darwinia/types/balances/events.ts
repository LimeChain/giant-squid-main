import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v6100 from '../v6100'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded.
     */
    v6100: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v6100.AccountId20,
            to: v6100.AccountId20,
            amount: sts.bigint(),
        })
    ),
}
