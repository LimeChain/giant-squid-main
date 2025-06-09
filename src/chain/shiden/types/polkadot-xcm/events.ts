import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v49 from '../v49'
import * as v90 from '../v90'
import * as v96 from '../v96'
import * as v120 from '../v120'
import * as v130 from '../v130'
import * as v1500 from '../v1500'

export const sent =  {
    name: 'PolkadotXcm.Sent',
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v49: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v49.V1MultiLocation, v49.V1MultiLocation, sts.array(() => v49.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v90: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v90.V1MultiLocation, v90.V1MultiLocation, sts.array(() => v90.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v96: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v96.V3MultiLocation, v96.V3MultiLocation, sts.array(() => v96.V3Instruction)])
    ),
    /**
     * A XCM message was sent.
     */
    v120: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v120.V3MultiLocation,
            destination: v120.V3MultiLocation,
            message: sts.array(() => v120.V3Instruction),
            messageId: sts.bytes(),
        })
    ),
    /**
     * A XCM message was sent.
     */
    v130: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v130.V4Location,
            destination: v130.V4Location,
            message: sts.array(() => v130.V4Instruction),
            messageId: sts.bytes(),
        })
    ),
    /**
     * A XCM message was sent.
     */
    v1500: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v1500.V5Location,
            destination: v1500.V5Location,
            message: sts.array(() => v1500.V5Instruction),
            messageId: sts.bytes(),
        })
    ),
}
