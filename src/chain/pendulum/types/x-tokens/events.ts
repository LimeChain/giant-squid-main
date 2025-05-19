import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1 from '../v1'
import * as v2 from '../v2'
import * as v9 from '../v9'
import * as v20 from '../v20'

export const transferredMultiAssets =  {
    name: 'XTokens.TransferredMultiAssets',
    /**
     * Transferred `MultiAsset` with fee.
     */
    v1: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v1.AccountId32,
            assets: sts.array(() => v1.V1MultiAsset),
            fee: v1.V1MultiAsset,
            dest: v1.V1MultiLocation,
        })
    ),
    /**
     * Transferred `MultiAsset` with fee.
     */
    v2: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v2.AccountId32,
            assets: sts.array(() => v2.V1MultiAsset),
            fee: v2.V1MultiAsset,
            dest: v2.V1MultiLocation,
        })
    ),
    /**
     * Transferred `MultiAsset` with fee.
     */
    v9: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v9.AccountId32,
            assets: sts.array(() => v9.V3MultiAsset),
            fee: v9.V3MultiAsset,
            dest: v9.V3MultiLocation,
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
