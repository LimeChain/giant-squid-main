import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v20 from '../v20'
import * as v32 from '../v32'

export const sent =  {
    name: 'PolkadotXcm.Sent',
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v20: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v20.V1MultiLocation, v20.V1MultiLocation, sts.array(() => v20.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     */
    v32: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v32.V3MultiLocation,
            destination: v32.V3MultiLocation,
            message: sts.array(() => v32.V3Instruction),
            messageId: sts.bytes(),
        })
    ),
}
