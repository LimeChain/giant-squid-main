import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v9140 from '../v9140'
import * as v9170 from '../v9170'
import * as v9370 from '../v9370'
import * as v9420 from '../v9420'
import * as v1000001 from '../v1000001'
import * as v1002000 from '../v1002000'
import * as v1005001 from '../v1005001'

export const sent =  {
    name: 'XcmPallet.Sent',
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v9140: new EventType(
        'XcmPallet.Sent',
        sts.tuple([v9140.V1MultiLocation, v9140.V1MultiLocation, sts.array(() => v9140.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v9170: new EventType(
        'XcmPallet.Sent',
        sts.tuple([v9170.V1MultiLocation, v9170.V1MultiLocation, sts.array(() => v9170.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v9370: new EventType(
        'XcmPallet.Sent',
        sts.tuple([v9370.V1MultiLocation, v9370.V1MultiLocation, sts.array(() => v9370.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v9420: new EventType(
        'XcmPallet.Sent',
        sts.tuple([v9420.V3MultiLocation, v9420.V3MultiLocation, sts.array(() => v9420.V3Instruction)])
    ),
    /**
     * A XCM message was sent.
     */
    v1000001: new EventType(
        'XcmPallet.Sent',
        sts.struct({
            origin: v1000001.V3MultiLocation,
            destination: v1000001.V3MultiLocation,
            message: sts.array(() => v1000001.V3Instruction),
            messageId: sts.bytes(),
        })
    ),
    /**
     * A XCM message was sent.
     */
    v1002000: new EventType(
        'XcmPallet.Sent',
        sts.struct({
            origin: v1002000.V4Location,
            destination: v1002000.V4Location,
            message: sts.array(() => v1002000.V4Instruction),
            messageId: sts.bytes(),
        })
    ),
    /**
     * A XCM message was sent.
     */
    v1005001: new EventType(
        'XcmPallet.Sent',
        sts.struct({
            origin: v1005001.V5Location,
            destination: v1005001.V5Location,
            message: sts.array(() => v1005001.V5Instruction),
            messageId: sts.bytes(),
        })
    ),
}
