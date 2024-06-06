import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v277 from '../v277'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded.
     */
    v277: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v277.AccountId32,
            to: v277.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
