import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as integriteeParachainV14 from '../integriteeParachainV14'
import * as integriteeParachainV35 from '../integriteeParachainV35'
import * as integriteeParachainV42 from '../integriteeParachainV42'
import * as integriteeParachainV520 from '../integriteeParachainV520'

export const sent =  {
    name: 'PolkadotXcm.Sent',
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    integriteeParachainV14: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([integriteeParachainV14.V1MultiLocation, integriteeParachainV14.V1MultiLocation, sts.array(() => integriteeParachainV14.V2Instruction)])
    ),
    /**
     * A XCM message was sent.
     * 
     * \[ origin, destination, message \]
     */
    integriteeParachainV35: new EventType(
        'PolkadotXcm.Sent',
        sts.tuple([integriteeParachainV35.V3MultiLocation, integriteeParachainV35.V3MultiLocation, sts.array(() => integriteeParachainV35.V3Instruction)])
    ),
    /**
     * A XCM message was sent.
     */
    integriteeParachainV42: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: integriteeParachainV42.V3MultiLocation,
            destination: integriteeParachainV42.V3MultiLocation,
            message: sts.array(() => integriteeParachainV42.V3Instruction),
            messageId: sts.bytes(),
        })
    ),
    /**
     * A XCM message was sent.
     */
    integriteeParachainV520: new EventType(
        'PolkadotXcm.Sent',
        sts.struct({
            origin: integriteeParachainV520.V4Location,
            destination: integriteeParachainV520.V4Location,
            message: sts.array(() => integriteeParachainV520.V4Instruction),
            messageId: sts.bytes(),
        })
    ),
}
