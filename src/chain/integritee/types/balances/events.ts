import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as integriteeParachainV3 from '../integriteeParachainV3'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded.
     */
    integriteeParachainV3: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: integriteeParachainV3.AccountId32,
            to: integriteeParachainV3.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
