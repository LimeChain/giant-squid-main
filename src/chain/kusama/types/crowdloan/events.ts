import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v9010 from '../v9010'
import * as v9230 from '../v9230'

export const contributed =  {
    name: 'Crowdloan.Contributed',
    /**
     *  Contributed to a crowd sale. [who, fund_index, amount]
     */
    v9010: new EventType(
        'Crowdloan.Contributed',
        sts.tuple([v9010.AccountId, v9010.ParaId, v9010.Balance])
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

export const withdrew =  {
    name: 'Crowdloan.Withdrew',
    /**
     *  Withdrew full balance of a contributor. [who, fund_index, amount]
     */
    v9010: new EventType(
        'Crowdloan.Withdrew',
        sts.tuple([v9010.AccountId, v9010.ParaId, v9010.Balance])
    ),
    /**
     * Withdrew full balance of a contributor.
     */
    v9230: new EventType(
        'Crowdloan.Withdrew',
        sts.struct({
            who: v9230.AccountId32,
            fundIndex: v9230.Id,
            amount: sts.bigint(),
        })
    ),
}

export const partiallyRefunded =  {
    name: 'Crowdloan.PartiallyRefunded',
    /**
     *  The loans in a fund have been partially dissolved, i.e. there are some left
     *  over child keys that still need to be killed. [fund_index]
     */
    v9010: new EventType(
        'Crowdloan.PartiallyRefunded',
        v9010.ParaId
    ),
    /**
     * The loans in a fund have been partially dissolved, i.e. there are some left
     * over child keys that still need to be killed.
     */
    v9230: new EventType(
        'Crowdloan.PartiallyRefunded',
        sts.struct({
            paraId: v9230.Id,
        })
    ),
}

export const allRefunded =  {
    name: 'Crowdloan.AllRefunded',
    /**
     *  All loans in a fund have been refunded. [fund_index]
     */
    v9010: new EventType(
        'Crowdloan.AllRefunded',
        v9010.ParaId
    ),
    /**
     * All loans in a fund have been refunded.
     */
    v9230: new EventType(
        'Crowdloan.AllRefunded',
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
