import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v200 from '../v200'
import * as v10016 from '../v10016'

export const sent =  {
    name: 'PolkadotXcm.Sent',
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v200: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v200.V1MultiLocation, v200.V1MultiLocation, sts.array(() => v200.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v10016: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v10016.V3MultiLocation, v10016.V3MultiLocation, sts.array(() => v10016.V3Instruction)])
    ),
}
