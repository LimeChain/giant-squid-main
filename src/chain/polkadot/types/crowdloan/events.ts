import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v9110 from '../v9110'
import * as v9230 from '../v9230'

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
