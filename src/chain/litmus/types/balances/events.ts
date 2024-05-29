import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v9020 from '../v9020'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded.
     */
    v9020: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v9020.AccountId32,
            to: v9020.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
