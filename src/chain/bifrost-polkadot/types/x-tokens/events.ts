import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v952 from '../v952'
import * as v970 from '../v970'
import * as v972 from '../v972'
import * as v10000 from '../v10000'
import * as v11000 from '../v11000'

export const transferredMultiAssets =  {
    name: 'XTokens.TransferredMultiAssets',
    /**
     * Transferred `MultiAsset` with fee.
     */
    v952: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v952.AccountId32,
            assets: sts.array(() => v952.V1MultiAsset),
            fee: v952.V1MultiAsset,
            dest: v952.V1MultiLocation,
        })
    ),
    /**
     * Transferred `MultiAsset` with fee.
     */
    v970: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v970.AccountId32,
            assets: sts.array(() => v970.V1MultiAsset),
            fee: v970.V1MultiAsset,
            dest: v970.V1MultiLocation,
        })
    ),
    /**
     * Transferred `MultiAsset` with fee.
     */
    v972: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v972.AccountId32,
            assets: sts.array(() => v972.V3MultiAsset),
            fee: v972.V3MultiAsset,
            dest: v972.V3MultiLocation,
        })
    ),
    /**
     * Transferred `MultiAsset` with fee.
     */
    v10000: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v10000.AccountId32,
            assets: sts.array(() => v10000.V3MultiAsset),
            fee: v10000.V3MultiAsset,
            dest: v10000.V3MultiLocation,
        })
    ),
}

export const transferredAssets =  {
    name: 'XTokens.TransferredAssets',
    /**
     * Transferred `Asset` with fee.
     */
    v11000: new EventType(
        'XTokens.TransferredAssets',
        sts.struct({
            sender: v11000.AccountId32,
            assets: sts.array(() => v11000.V4Asset),
            fee: v11000.V4Asset,
            dest: v11000.V4Location,
        })
    ),
}
