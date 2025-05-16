import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1 from '../v1'
import * as v5 from '../v5'
import * as v20 from '../v20'
import * as v32 from '../v32'
import * as v45 from '../v45'

export const sent =  {
    name: 'PolkadotXcm.Sent',
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v1: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v1.V1MultiLocation, v1.V1MultiLocation, sts.array(() => v1.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v5: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v5.V1MultiLocation, v5.V1MultiLocation, sts.array(() => v5.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v20: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v20.V1MultiLocation, v20.V1MultiLocation, sts.array(() => v20.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v32: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v32.V3MultiLocation, v32.V3MultiLocation, sts.array(() => v32.V3Instruction)])
    ),
    /**
     * A XCM message was sent.
     */
    v45: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v45.V3MultiLocation,
            destination: v45.V3MultiLocation,
            message: sts.array(() => v45.V3Instruction),
            messageId: sts.bytes(),
        })
    ),
}
