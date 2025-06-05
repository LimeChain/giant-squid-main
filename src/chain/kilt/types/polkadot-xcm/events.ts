import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v10710 from '../v10710'
import * as v10890 from '../v10890'
import * as v11000 from '../v11000'
import * as v11210 from '../v11210'
import * as v11401 from '../v11401'

export const sent =  {
    name: 'PolkadotXcm.Sent',
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v10710: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v10710.V1MultiLocation, v10710.V1MultiLocation, sts.array(() => v10710.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v10890: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v10890.V1MultiLocation, v10890.V1MultiLocation, sts.array(() => v10890.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v11000: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v11000.V3MultiLocation, v11000.V3MultiLocation, sts.array(() => v11000.V3Instruction)])
    ),
    /**
     * A XCM message was sent.
     */
    v11210: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v11210.V3MultiLocation,
            destination: v11210.V3MultiLocation,
            message: sts.array(() => v11210.V3Instruction),
            messageId: sts.bytes(),
        })
    ),
    /**
     * A XCM message was sent.
     */
    v11401: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v11401.V4Location,
            destination: v11401.V4Location,
            message: sts.array(() => v11401.V4Instruction),
            messageId: sts.bytes(),
        })
    ),
}
