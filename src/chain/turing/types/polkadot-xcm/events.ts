import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v277 from '../v277'
import * as v293 from '../v293'

export const sent =  {
    name: 'PolkadotXcm.Sent',
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v277: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v277.V1MultiLocation, v277.V1MultiLocation, sts.array(() => v277.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v293: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v293.V3MultiLocation, v293.V3MultiLocation, sts.array(() => v293.V3Instruction)])
    ),
}
