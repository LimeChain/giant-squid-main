import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1160 from '../v1160'
import * as v1221 from '../v1221'
import * as v1260 from '../v1260'

export const sent =  {
    name: 'PolkadotXcm.Sent',
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v1160: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v1160.V1MultiLocation, v1160.V1MultiLocation, sts.array(() => v1160.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v1221: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v1221.V3MultiLocation, v1221.V3MultiLocation, sts.array(() => v1221.V3Instruction)])
    ),
    /**
     * A XCM message was sent.
     */
    v1260: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v1260.V3MultiLocation,
            destination: v1260.V3MultiLocation,
            message: sts.array(() => v1260.V3Instruction),
            messageId: sts.bytes(),
        })
    ),
}
