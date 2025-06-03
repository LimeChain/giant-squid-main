import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1 from '../v1'
import * as v2 from '../v2'
import * as v9 from '../v9'
import * as v19 from '../v19'
import * as v20 from '../v20'

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
    v2: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v2.V1MultiLocation, v2.V1MultiLocation, sts.array(() => v2.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v9: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v9.V3MultiLocation, v9.V3MultiLocation, sts.array(() => v9.V3Instruction)])
    ),
    /**
     * A XCM message was sent.
     */
    v19: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v19.V3MultiLocation,
            destination: v19.V3MultiLocation,
            message: sts.array(() => v19.V3Instruction),
            messageId: sts.bytes(),
        })
    ),
    /**
     * A XCM message was sent.
     */
    v20: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v20.V3MultiLocation,
            destination: v20.V3MultiLocation,
            message: sts.array(() => v20.V3Instruction),
            messageId: sts.bytes(),
        })
    ),
}
