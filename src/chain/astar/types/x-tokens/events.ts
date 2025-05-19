import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v70 from '../v70'
import * as v91 from '../v91'

export const transferredMultiAssets =  {
    name: 'XTokens.TransferredMultiAssets',
    /**
     * Transferred `MultiAsset` with fee.
     */
    v70: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v70.AccountId32,
            assets: sts.array(() => v70.V3MultiAsset),
            fee: v70.V3MultiAsset,
            dest: v70.V3MultiLocation,
        })
    ),
}

export const transferredAssets =  {
    name: 'XTokens.TransferredAssets',
    /**
     * Transferred `Asset` with fee.
     */
    v91: new EventType(
        'XTokens.TransferredAssets',
        sts.struct({
            sender: v91.AccountId32,
            assets: sts.array(() => v91.V4Asset),
            fee: v91.V4Asset,
            dest: v91.V4Location,
        })
    ),
}
