import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1000 from '../v1000'
import * as v10016 from '../v10016'

export const transferredMultiAssets =  {
    name: 'XTokens.TransferredMultiAssets',
    /**
     * Transferred `MultiAsset` with fee.
     */
    v1000: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v1000.AccountId32,
            assets: sts.array(() => v1000.V1MultiAsset),
            fee: v1000.V1MultiAsset,
            dest: v1000.V1MultiLocation,
        })
    ),
    /**
     * Transferred `MultiAsset` with fee.
     */
    v10016: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v10016.AccountId32,
            assets: sts.array(() => v10016.V3MultiAsset),
            fee: v10016.V3MultiAsset,
            dest: v10016.V3MultiLocation,
        })
    ),
}
