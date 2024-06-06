import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v932 from '../v932'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded.
     */
    v932: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v932.AccountId32,
            to: v932.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
