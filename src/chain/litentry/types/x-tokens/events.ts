import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v9101 from '../v9101'
import * as v9150 from '../v9150'
import * as v9168 from '../v9168'

export const transferredMultiAssets =  {
    name: 'XTokens.TransferredMultiAssets',
    /**
     * Transferred `MultiAsset` with fee.
     */
    v9101: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v9101.AccountId32,
            assets: sts.array(() => v9101.V1MultiAsset),
            fee: v9101.V1MultiAsset,
            dest: v9101.V1MultiLocation,
        })
    ),
    /**
     * Transferred `MultiAsset` with fee.
     */
    v9150: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v9150.AccountId32,
            assets: sts.array(() => v9150.V1MultiAsset),
            fee: v9150.V1MultiAsset,
            dest: v9150.V1MultiLocation,
        })
    ),
    /**
     * Transferred `MultiAsset` with fee.
     */
    v9168: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v9168.AccountId32,
            assets: sts.array(() => v9168.V3MultiAsset),
            fee: v9168.V3MultiAsset,
            dest: v9168.V3MultiLocation,
        })
    ),
}
