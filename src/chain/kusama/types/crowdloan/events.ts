import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v9010 from '../v9010'
import * as v9230 from '../v9230'

export const created =  {
    name: 'Crowdloan.Created',
    /**
     *  Create a new crowdloaning campaign. [fund_index]
     */
    v9010: new EventType(
        'Crowdloan.Created',
        v9010.ParaId
    ),
    /**
     * Create a new crowdloaning campaign.
     */
    v9230: new EventType(
        'Crowdloan.Created',
        sts.struct({
            paraId: v9230.Id,
        })
    ),
}

export const dissolved =  {
    name: 'Crowdloan.Dissolved',
    /**
     *  Fund is dissolved. [fund_index]
     */
    v9010: new EventType(
        'Crowdloan.Dissolved',
        v9010.ParaId
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
