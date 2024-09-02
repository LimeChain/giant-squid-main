import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v9110 from '../v9110'

export const create =  {
    name: 'Crowdloan.create',
    /**
     * Create a new crowdloaning campaign for a parachain slot with the given lease period range.
     * 
     * This applies a lock to your parachain configuration, ensuring that it cannot be changed
     * by the parachain manager.
     */
    v9110: new CallType(
        'Crowdloan.create',
        sts.struct({
            index: sts.number(),
            cap: sts.bigint(),
            firstPeriod: sts.number(),
            lastPeriod: sts.number(),
            end: sts.number(),
            verifier: sts.option(() => v9110.MultiSigner),
        })
    ),
}
