import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v9110 from '../v9110'
import * as v9230 from '../v9230'

export const contributed =  {
    name: 'Crowdloan.Contributed',
    /**
     * Contributed to a crowd sale. `[who, fund_index, amount]`
     */
    v9110: new EventType(
        'Crowdloan.Contributed',
        sts.tuple([v9110.AccountId32, v9110.Id, sts.bigint()])
    ),
    /**
     * Contributed to a crowd sale.
     */
    v9230: new EventType(
        'Crowdloan.Contributed',
        sts.struct({
            who: v9230.AccountId32,
            fundIndex: v9230.Id,
            amount: sts.bigint(),
        })
    ),
}

export const dissolved =  {
    name: 'Crowdloan.Dissolved',
    /**
     * Fund is dissolved. `[fund_index]`
     */
    v9110: new EventType(
        'Crowdloan.Dissolved',
        v9110.Id
    ),
    /**
     * Fund is dissolved.
     */
    v9230: new EventType(
        'Crowdloan.Dissolved',
        sts.struct({
            paraId: v9230.Id,
        })
    ),
}
