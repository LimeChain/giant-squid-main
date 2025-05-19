import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v6 from '../v6'
import * as v7 from '../v7'
import * as v10 from '../v10'
import * as v20 from '../v20'

export const transferredMultiAssets =  {
    name: 'XTokens.TransferredMultiAssets',
    /**
     * Transferred `MultiAsset` with fee.
     */
    v6: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v6.AccountId32,
            assets: sts.array(() => v6.V1MultiAsset),
            fee: v6.V1MultiAsset,
            dest: v6.V1MultiLocation,
        })
    ),
    /**
     * Transferred `MultiAsset` with fee.
     */
    v7: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v7.AccountId32,
            assets: sts.array(() => v7.V1MultiAsset),
            fee: v7.V1MultiAsset,
            dest: v7.V1MultiLocation,
        })
    ),
    /**
     * Transferred `MultiAsset` with fee.
     */
    v10: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v10.AccountId32,
            assets: sts.array(() => v10.V3MultiAsset),
            fee: v10.V3MultiAsset,
            dest: v10.V3MultiLocation,
        })
    ),
    /**
     * Transferred `MultiAsset` with fee.
     */
    v20: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v20.AccountId32,
            assets: sts.array(() => v20.V3MultiAsset),
            fee: v20.V3MultiAsset,
            dest: v20.V3MultiLocation,
        })
    ),
}
