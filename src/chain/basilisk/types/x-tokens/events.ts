import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v38 from '../v38'
import * as v43 from '../v43'
import * as v101 from '../v101'
import * as v115 from '../v115'

export const transferredMultiAssets =  {
    name: 'XTokens.TransferredMultiAssets',
    /**
     * Transferred `MultiAsset` with fee.
     */
    v38: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v38.AccountId32,
            assets: sts.array(() => v38.V1MultiAsset),
            dest: v38.V1MultiLocation,
        })
    ),
    /**
     * Transferred `MultiAsset` with fee.
     */
    v43: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v43.AccountId32,
            assets: sts.array(() => v43.V1MultiAsset),
            fee: v43.V1MultiAsset,
            dest: v43.V1MultiLocation,
        })
    ),
    /**
     * Transferred `MultiAsset` with fee.
     */
    v101: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v101.AccountId32,
            assets: sts.array(() => v101.V3MultiAsset),
            fee: v101.V3MultiAsset,
            dest: v101.V3MultiLocation,
        })
    ),
}

export const transferredAssets =  {
    name: 'XTokens.TransferredAssets',
    /**
     * Transferred `Asset` with fee.
     */
    v115: new EventType(
        'XTokens.TransferredAssets',
        sts.struct({
            sender: v115.AccountId32,
            assets: sts.array(() => v115.V4Asset),
            fee: v115.V4Asset,
            dest: v115.V4Location,
        })
    ),
}
