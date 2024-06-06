import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1090 from '../v1090'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded.
     */
    v1090: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v1090.AccountId32,
            to: v1090.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
