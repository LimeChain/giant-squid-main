import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v49 from '../v49'
import * as v1801 from '../v1801'

export const log =  {
    name: 'EVM.Log',
    /**
     *  Ethereum events from contracts.
     */
    v49: new EventType(
        'EVM.Log',
        v49.EvmLog
    ),
    /**
     * Ethereum events from contracts.
     */
    v1801: new EventType(
        'EVM.Log',
        sts.struct({
            log: v1801.Log,
        })
    ),
}
