import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1101 from '../v1101'
import * as v1300 from '../v1300'
import * as v2201 from '../v2201'
import * as v2302 from '../v2302'
import * as v2602 from '../v2602'
import * as v2901 from '../v2901'
import * as v3701 from '../v3701'

export const sent =  {
    name: 'PolkadotXcm.Sent',
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v1101: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v1101.V1MultiLocation, v1101.V1MultiLocation, sts.array(() => v1101.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v1300: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v1300.V1MultiLocation, v1300.V1MultiLocation, sts.array(() => v1300.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v2201: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v2201.V1MultiLocation, v2201.V1MultiLocation, sts.array(() => v2201.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v2302: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v2302.V3MultiLocation, v2302.V3MultiLocation, sts.array(() => v2302.V3Instruction)])
    ),
    /**
     * A XCM message was sent.
     */
    v2602: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v2602.V3MultiLocation,
            destination: v2602.V3MultiLocation,
            message: sts.array(() => v2602.V3Instruction),
            messageId: sts.bytes(),
        })
    ),
    /**
     * A XCM message was sent.
     */
    v2901: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v2901.V4Location,
            destination: v2901.V4Location,
            message: sts.array(() => v2901.V4Instruction),
            messageId: sts.bytes(),
        })
    ),
    /**
     * A XCM message was sent.
     */
    v3701: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v3701.V5Location,
            destination: v3701.V5Location,
            message: sts.array(() => v3701.V5Instruction),
            messageId: sts.bytes(),
        })
    ),
}
