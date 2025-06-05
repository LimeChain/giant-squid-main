import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v281 from '../v281'
import * as v293 from '../v293'

export const transferredMultiAssets =  {
    name: 'XTokens.TransferredMultiAssets',
    /**
     * Transferred `MultiAsset` with fee.
     */
    v281: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v281.AccountId32,
            assets: sts.array(() => v281.V1MultiAsset),
            fee: v281.V1MultiAsset,
            dest: v281.V1MultiLocation,
        })
    ),
    /**
     * Transferred `MultiAsset` with fee.
     */
    v293: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v293.AccountId32,
            assets: sts.array(() => v293.V3MultiAsset),
            fee: v293.V3MultiAsset,
            dest: v293.V3MultiLocation,
        })
    ),
}
