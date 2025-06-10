import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v9010 from '../v9010'
import * as v9100 from '../v9100'
import * as v9111 from '../v9111'
import * as v9160 from '../v9160'
import * as v9370 from '../v9370'
import * as v9381 from '../v9381'
import * as v1000000 from '../v1000000'
import * as v1002000 from '../v1002000'
import * as v1005000 from '../v1005000'

export const sent =  {
    name: 'XcmPallet.Sent',
    v9010: new EventType(
        'XcmPallet.Sent',
        sts.tuple([v9010.MultiLocation, v9010.MultiLocation, v9010.Xcm])
    ),
    v9100: new EventType(
        'XcmPallet.Sent',
        sts.tuple([v9100.MultiLocation, v9100.MultiLocation, v9100.Xcm])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v9111: new EventType(
        'XcmPallet.Sent',
        sts.tuple([v9111.V1MultiLocation, v9111.V1MultiLocation, sts.array(() => v9111.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v9160: new EventType(
        'XcmPallet.Sent',
        sts.tuple([v9160.V1MultiLocation, v9160.V1MultiLocation, sts.array(() => v9160.V2Instruction)])
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
    v9381: new EventType(
        'XcmPallet.Sent',
        sts.tuple([v9381.V3MultiLocation, v9381.V3MultiLocation, sts.array(() => v9381.V3Instruction)])
    ),
    /**
     * A XCM message was sent.
     */
    v1000000: new EventType(
        'XcmPallet.Sent',
        sts.struct({
            origin: v1000000.V3MultiLocation,
            destination: v1000000.V3MultiLocation,
            message: sts.array(() => v1000000.V3Instruction),
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
    v1005000: new EventType(
        'XcmPallet.Sent',
        sts.struct({
            origin: v1005000.V5Location,
            destination: v1005000.V5Location,
            message: sts.array(() => v1005000.V5Instruction),
            messageId: sts.bytes(),
        })
    ),
}
