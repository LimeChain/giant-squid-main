import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v900 from '../v900'
import * as v1802 from '../v1802'

export const log =  {
    name: 'EVM.Log',
    /**
     * Ethereum events from contracts.
     */
    v900: new EventType(
        'EVM.Log',
        v900.Log
    ),
    /**
     * Ethereum events from contracts.
     */
    v1802: new EventType(
        'EVM.Log',
        sts.struct({
            log: v1802.Log,
        })
    ),
}
