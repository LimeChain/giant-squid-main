import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v6100 from '../v6100'
import * as v6501 from '../v6501'
import * as v6640 from '../v6640'

export const sent =  {
    name: 'PolkadotXcm.Sent',
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v6100: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v6100.V3MultiLocation, v6100.V3MultiLocation, sts.array(() => v6100.V3Instruction)])
    ),
    /**
     * A XCM message was sent.
     */
    v6501: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v6501.V3MultiLocation,
            destination: v6501.V3MultiLocation,
            message: sts.array(() => v6501.V3Instruction),
            messageId: sts.bytes(),
        })
    ),
    /**
     * A XCM message was sent.
     */
    v6640: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v6640.V4Location,
            destination: v6640.V4Location,
            message: sts.array(() => v6640.V4Instruction),
            messageId: sts.bytes(),
        })
    ),
}
