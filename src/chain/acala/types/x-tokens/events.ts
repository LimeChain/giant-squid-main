import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v2032 from '../v2032'
import * as v2040 from '../v2040'
import * as v2180 from '../v2180'
import * as v2240 from '../v2240'
import * as v2250 from '../v2250'

export const transferredMultiAssets =  {
    name: 'XTokens.TransferredMultiAssets',
    /**
     * Transferred `MultiAsset` with fee.
     */
    v2032: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v2032.AccountId32,
            assets: sts.array(() => v2032.V1MultiAsset),
            dest: v2032.V1MultiLocation,
        })
    ),
    /**
     * Transferred `MultiAsset` with fee.
     */
    v2040: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v2040.AccountId32,
            assets: sts.array(() => v2040.V1MultiAsset),
            fee: v2040.V1MultiAsset,
            dest: v2040.V1MultiLocation,
        })
    ),
    v2180: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v2180.AccountId32,
            assets: sts.array(() => v2180.V3MultiAsset),
            fee: v2180.V3MultiAsset,
            dest: v2180.V3MultiLocation,
        })
    ),
    v2240: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v2240.AccountId32,
            assets: sts.array(() => v2240.V3MultiAsset),
            fee: v2240.V3MultiAsset,
            dest: v2240.V3MultiLocation,
        })
    ),
}

export const transferredAssets =  {
    name: 'XTokens.TransferredAssets',
    v2250: new EventType(
        'XTokens.TransferredAssets',
        sts.struct({
            sender: v2250.AccountId32,
            assets: sts.array(() => v2250.V4Asset),
            fee: v2250.V4Asset,
            dest: v2250.V4Location,
        })
    ),
}
