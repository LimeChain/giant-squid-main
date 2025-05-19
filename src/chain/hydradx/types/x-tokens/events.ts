import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v108 from '../v108'
import * as v115 from '../v115'
import * as v160 from '../v160'
import * as v244 from '../v244'

export const transferredMultiAssets =  {
    name: 'XTokens.TransferredMultiAssets',
    /**
     * Transferred `MultiAsset` with fee.
     */
    v108: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v108.AccountId32,
            assets: sts.array(() => v108.V1MultiAsset),
            dest: v108.V1MultiLocation,
        })
    ),
    /**
     * Transferred `MultiAsset` with fee.
     */
    v115: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v115.AccountId32,
            assets: sts.array(() => v115.V1MultiAsset),
            fee: v115.V1MultiAsset,
            dest: v115.V1MultiLocation,
        })
    ),
    /**
     * Transferred `MultiAsset` with fee.
     */
    v160: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v160.AccountId32,
            assets: sts.array(() => v160.V3MultiAsset),
            fee: v160.V3MultiAsset,
            dest: v160.V3MultiLocation,
        })
    ),
}

export const transferredAssets =  {
    name: 'XTokens.TransferredAssets',
    /**
     * Transferred `Asset` with fee.
     */
    v244: new EventType(
        'XTokens.TransferredAssets',
        sts.struct({
            sender: v244.AccountId32,
            assets: sts.array(() => v244.V4Asset),
            fee: v244.V4Asset,
            dest: v244.V4Location,
        })
    ),
}
