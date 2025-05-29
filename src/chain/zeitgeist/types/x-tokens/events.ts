import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v41 from '../v41'
import * as v48 from '../v48'
import * as v49 from '../v49'

export const transferredMultiAssets =  {
    name: 'XTokens.TransferredMultiAssets',
    /**
     * Transferred `MultiAsset` with fee.
     */
    v41: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v41.AccountId32,
            assets: sts.array(() => v41.V1MultiAsset),
            fee: v41.V1MultiAsset,
            dest: v41.V1MultiLocation,
        })
    ),
    /**
     * Transferred `MultiAsset` with fee.
     */
    v48: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v48.AccountId32,
            assets: sts.array(() => v48.V1MultiAsset),
            fee: v48.V1MultiAsset,
            dest: v48.V1MultiLocation,
        })
    ),
    /**
     * Transferred `MultiAsset` with fee.
     */
    v49: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v49.AccountId32,
            assets: sts.array(() => v49.V3MultiAsset),
            fee: v49.V3MultiAsset,
            dest: v49.V3MultiLocation,
        })
    ),
}
