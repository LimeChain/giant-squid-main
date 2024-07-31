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

export const withdrew =  {
    name: 'Crowdloan.Withdrew',
    /**
     * Withdrew full balance of a contributor. `[who, fund_index, amount]`
     */
    v9110: new EventType(
        'Crowdloan.Withdrew',
        sts.tuple([v9110.AccountId32, v9110.Id, sts.bigint()])
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
     * The loans in a fund have been partially dissolved, i.e. there are some left
     * over child keys that still need to be killed. `[fund_index]`
     */
    v9110: new EventType(
        'Crowdloan.PartiallyRefunded',
        v9110.Id
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
     * All loans in a fund have been refunded. `[fund_index]`
     */
    v9110: new EventType(
        'Crowdloan.AllRefunded',
        v9110.Id
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
