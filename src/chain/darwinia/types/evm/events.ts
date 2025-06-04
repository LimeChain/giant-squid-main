import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v6100 from '../v6100'

export const log =  {
    name: 'EVM.Log',
    /**
     * Ethereum events from contracts.
     */
    v6100: new EventType(
        'EVM.Log',
        sts.struct({
            log: v6100.Log,
        })
    ),
}
