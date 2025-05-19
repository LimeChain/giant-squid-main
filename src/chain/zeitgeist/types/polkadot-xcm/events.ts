import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v26 from '../v26'
import * as v32 from '../v32'
import * as v34 from '../v34'
import * as v48 from '../v48'
import * as v49 from '../v49'
import * as v56 from '../v56'

export const sent =  {
    name: 'PolkadotXcm.Sent',
    v26: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v26.MultiLocation, v26.MultiLocation, sts.array(() => v26.InstructionV2)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v32: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v32.V1MultiLocation, v32.V1MultiLocation, sts.array(() => v32.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v34: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v34.V1MultiLocation, v34.V1MultiLocation, sts.array(() => v34.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v48: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v48.V1MultiLocation, v48.V1MultiLocation, sts.array(() => v48.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v49: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v49.V3MultiLocation, v49.V3MultiLocation, sts.array(() => v49.V3Instruction)])
    ),
    /**
     * A XCM message was sent.
     */
    v56: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v56.V3MultiLocation,
            destination: v56.V3MultiLocation,
            message: sts.array(() => v56.V3Instruction),
            messageId: sts.bytes(),
        })
    ),
}
