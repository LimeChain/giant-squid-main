import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v0 from '../v0'
import * as v9140 from '../v9140'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     *  Transfer succeeded (from, to, value).
     */
    v0: new EventType(
        'Balances.Transfer',
        sts.tuple([v0.AccountId, v0.AccountId, v0.Balance])
    ),
    /**
     * Transfer succeeded.
     */
    v9140: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v9140.AccountId32,
            to: v9140.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
