import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v932 from '../v932'
import * as v970 from '../v970'
import * as v972 from '../v972'
import * as v990 from '../v990'
import * as v10000 from '../v10000'
import * as v11000 from '../v11000'

export const sent =  {
    name: 'PolkadotXcm.Sent',
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v932: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v932.V1MultiLocation, v932.V1MultiLocation, sts.array(() => v932.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v970: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v970.V1MultiLocation, v970.V1MultiLocation, sts.array(() => v970.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v972: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v972.V3MultiLocation, v972.V3MultiLocation, sts.array(() => v972.V3Instruction)])
    ),
    /**
     * A XCM message was sent.
     */
    v990: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v990.V3MultiLocation,
            destination: v990.V3MultiLocation,
            message: sts.array(() => v990.V3Instruction),
            messageId: sts.bytes(),
        })
    ),
    /**
     * A XCM message was sent.
     */
    v10000: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v10000.V3MultiLocation,
            destination: v10000.V3MultiLocation,
            message: sts.array(() => v10000.V3Instruction),
            messageId: sts.bytes(),
        })
    ),
    /**
     * A XCM message was sent.
     */
    v11000: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v11000.V4Location,
            destination: v11000.V4Location,
            message: sts.array(() => v11000.V4Instruction),
            messageId: sts.bytes(),
        })
    ),
}
