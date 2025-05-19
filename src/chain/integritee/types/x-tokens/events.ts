import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as integriteeParachainV18 from '../integriteeParachainV18'
import * as integriteeParachainV35 from '../integriteeParachainV35'
import * as integriteeParachainV520 from '../integriteeParachainV520'

export const transferredMultiAssets =  {
    name: 'XTokens.TransferredMultiAssets',
    /**
     * Transferred `MultiAsset` with fee.
     */
    integriteeParachainV18: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: integriteeParachainV18.AccountId32,
            assets: sts.array(() => integriteeParachainV18.V1MultiAsset),
            fee: integriteeParachainV18.V1MultiAsset,
            dest: integriteeParachainV18.V1MultiLocation,
        })
    ),
    /**
     * Transferred `MultiAsset` with fee.
     */
    integriteeParachainV35: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: integriteeParachainV35.AccountId32,
            assets: sts.array(() => integriteeParachainV35.V3MultiAsset),
            fee: integriteeParachainV35.V3MultiAsset,
            dest: integriteeParachainV35.V3MultiLocation,
        })
    ),
}

export const transferredAssets =  {
    name: 'XTokens.TransferredAssets',
    /**
     * Transferred `Asset` with fee.
     */
    integriteeParachainV520: new EventType(
        'XTokens.TransferredAssets',
        sts.struct({
            sender: integriteeParachainV520.AccountId32,
            assets: sts.array(() => integriteeParachainV520.V4Asset),
            fee: integriteeParachainV520.V4Asset,
            dest: integriteeParachainV520.V4Location,
        })
    ),
}
