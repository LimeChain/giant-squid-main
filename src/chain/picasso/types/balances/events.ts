import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v200 from '../v200'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded.
     */
    v200: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v200.AccountId32,
            to: v200.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
