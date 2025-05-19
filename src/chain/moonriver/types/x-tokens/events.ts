import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1300 from '../v1300'
import * as v1401 from '../v1401'
import * as v2201 from '../v2201'
import * as v2302 from '../v2302'
import * as v2901 from '../v2901'

export const transferredMultiAssets =  {
    name: 'XTokens.TransferredMultiAssets',
    /**
     * Transferred `MultiAsset` with fee.
     */
    v1300: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v1300.AccountId20,
            assets: sts.array(() => v1300.V1MultiAsset),
            dest: v1300.V1MultiLocation,
        })
    ),
    /**
     * Transferred `MultiAsset` with fee.
     */
    v1401: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v1401.AccountId20,
            assets: sts.array(() => v1401.V1MultiAsset),
            fee: v1401.V1MultiAsset,
            dest: v1401.V1MultiLocation,
        })
    ),
    /**
     * Transferred `MultiAsset` with fee.
     */
    v2201: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v2201.AccountId20,
            assets: sts.array(() => v2201.V1MultiAsset),
            fee: v2201.V1MultiAsset,
            dest: v2201.V1MultiLocation,
        })
    ),
    /**
     * Transferred `MultiAsset` with fee.
     */
    v2302: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v2302.AccountId20,
            assets: sts.array(() => v2302.V3MultiAsset),
            fee: v2302.V3MultiAsset,
            dest: v2302.V3MultiLocation,
        })
    ),
}

export const transferredAssets =  {
    name: 'XTokens.TransferredAssets',
    /**
     * Transferred `Asset` with fee.
     */
    v2901: new EventType(
        'XTokens.TransferredAssets',
        sts.struct({
            sender: v2901.AccountId20,
            assets: sts.array(() => v2901.V4Asset),
            fee: v2901.V4Asset,
            dest: v2901.V4Location,
        })
    ),
}
