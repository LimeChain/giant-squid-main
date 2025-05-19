import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v108 from '../v108'
import * as v160 from '../v160'
import * as v205 from '../v205'
import * as v244 from '../v244'

export const sent =  {
    name: 'PolkadotXcm.Sent',
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v108: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v108.V1MultiLocation, v108.V1MultiLocation, sts.array(() => v108.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v160: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v160.V3MultiLocation, v160.V3MultiLocation, sts.array(() => v160.V3Instruction)])
    ),
    /**
     * A XCM message was sent.
     */
    v205: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v205.V3MultiLocation,
            destination: v205.V3MultiLocation,
            message: sts.array(() => v205.V3Instruction),
            messageId: sts.bytes(),
        })
    ),
    /**
     * A XCM message was sent.
     */
    v244: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v244.V4Location,
            destination: v244.V4Location,
            message: sts.array(() => v244.V4Instruction),
            messageId: sts.bytes(),
        })
    ),
}
