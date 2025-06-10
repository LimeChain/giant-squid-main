import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v110 from '../v110'
import * as v130 from '../v130'
import * as v1500 from '../v1500'

export const transferredMultiAssets =  {
    name: 'XTokens.TransferredMultiAssets',
    /**
     * Transferred `MultiAsset` with fee.
     */
    v110: new EventType(
        'XTokens.TransferredMultiAssets',
        sts.struct({
            sender: v110.AccountId32,
            assets: sts.array(() => v110.V3MultiAsset),
            fee: v110.V3MultiAsset,
            dest: v110.V3MultiLocation,
        })
    ),
}

export const transferredAssets =  {
    name: 'XTokens.TransferredAssets',
    /**
     * Transferred `Asset` with fee.
     */
    v130: new EventType(
        'XTokens.TransferredAssets',
        sts.struct({
            sender: v130.AccountId32,
            assets: sts.array(() => v130.V4Asset),
            fee: v130.V4Asset,
            dest: v130.V4Location,
        })
    ),
    /**
     * Transferred `Asset` with fee.
     */
    v1500: new EventType(
        'XTokens.TransferredAssets',
        sts.struct({
            sender: v1500.AccountId32,
            assets: sts.array(() => v1500.V5Asset),
            fee: v1500.V5Asset,
            dest: v1500.V5Location,
        })
    ),
}
