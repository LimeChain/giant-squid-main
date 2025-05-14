import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1009 from '../v1009'
import * as v1019 from '../v1019'
import * as v1020 from '../v1020'

export const transferredMultiAssets =  {
    name: 'XTokens.TransferredMultiAssets',
    /**
     * Transferred `MultiAsset` with fee.
     */
    v1009: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v1009.AccountId32,
            assets: sts.array(() => v1009.V1MultiAsset),
            fee: v1009.V1MultiAsset,
            dest: v1009.V1MultiLocation,
        })
    ),
    /**
     * Transferred `MultiAsset` with fee.
     */
    v1019: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v1019.AccountId32,
            assets: sts.array(() => v1019.V1MultiAsset),
            fee: v1019.V1MultiAsset,
            dest: v1019.V1MultiLocation,
        })
    ),
    /**
     * Transferred `MultiAsset` with fee.
     */
    v1020: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v1020.AccountId32,
            assets: sts.array(() => v1020.V3MultiAsset),
            fee: v1020.V3MultiAsset,
            dest: v1020.V3MultiLocation,
        })
    ),
}
