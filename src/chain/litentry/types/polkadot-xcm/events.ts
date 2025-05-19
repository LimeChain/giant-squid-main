import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v9000 from '../v9000'
import * as v9071 from '../v9071'
import * as v9150 from '../v9150'
import * as v9168 from '../v9168'
import * as v9200 from '../v9200'
import * as v9210 from '../v9210'

export const sent =  {
    name: 'PolkadotXcm.Sent',
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v9000: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v9000.V1MultiLocation, v9000.V1MultiLocation, sts.array(() => v9000.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v9071: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v9071.V1MultiLocation, v9071.V1MultiLocation, sts.array(() => v9071.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v9150: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v9150.V1MultiLocation, v9150.V1MultiLocation, sts.array(() => v9150.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    v9168: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([v9168.V3MultiLocation, v9168.V3MultiLocation, sts.array(() => v9168.V3Instruction)])
    ),
    /**
     * A XCM message was sent.
     */
    v9200: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v9200.V3MultiLocation,
            destination: v9200.V3MultiLocation,
            message: sts.array(() => v9200.V3Instruction),
            messageId: sts.bytes(),
        })
    ),
    /**
     * A XCM message was sent.
     */
    v9210: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: v9210.V4Location,
            destination: v9210.V4Location,
            message: sts.array(() => v9210.V4Instruction),
            messageId: sts.bytes(),
        })
    ),
}
