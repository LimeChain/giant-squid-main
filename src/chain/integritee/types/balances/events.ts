import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v3 from '../v3'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded.
     */
    v3: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v3.AccountId32,
            to: v3.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
