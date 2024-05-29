import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1 from '../v1'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded.
     */
    v1: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v1.AccountId32,
            to: v1.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
