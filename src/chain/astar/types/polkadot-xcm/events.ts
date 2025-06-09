import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v15 from '../v15'
import * as v52 from '../v52'
import * as v61 from '../v61'
import * as v82 from '../v82'
import * as v91 from '../v91'
import * as v1501 from '../v1501'

export const sent =  {
    name: 'PolkadotXcm.Sent',
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v15: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v15.V1MultiLocation, v15.V1MultiLocation, sts.array(() => v15.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v52: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v52.V1MultiLocation, v52.V1MultiLocation, sts.array(() => v52.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v61: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v61.V3MultiLocation, v61.V3MultiLocation, sts.array(() => v61.V3Instruction)])
    ),
    /**
     * A XCM message was sent.
     */
    v82: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v82.V3MultiLocation,
            destination: v82.V3MultiLocation,
            message: sts.array(() => v82.V3Instruction),
            messageId: sts.bytes(),
        })
    ),
    /**
     * A XCM message was sent.
     */
    v91: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v91.V4Location,
            destination: v91.V4Location,
            message: sts.array(() => v91.V4Instruction),
            messageId: sts.bytes(),
        })
    ),
    /**
     * A XCM message was sent.
     */
    v1501: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v1501.V5Location,
            destination: v1501.V5Location,
            message: sts.array(() => v1501.V5Instruction),
            messageId: sts.bytes(),
        })
    ),
}
