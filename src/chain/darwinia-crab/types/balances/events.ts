import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v6000 from '../v6000'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded.
     */
    v6000: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v6000.AccountId20,
            to: v6000.AccountId20,
            amount: sts.bigint(),
        })
    ),
}
