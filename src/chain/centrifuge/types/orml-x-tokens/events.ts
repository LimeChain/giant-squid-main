import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1024 from '../v1024'
import * as v1103 from '../v1103'

export const transferredMultiAssets =  {
    name: 'OrmlXTokens.TransferredMultiAssets',
    /**
     * Transferred `MultiAsset` with fee.
     */
    v1024: new EventType(
        'OrmlXTokens.TransferredMultiAssets',
        sts.struct({
            sender: v1024.AccountId32,
            assets: sts.array(() => v1024.V3MultiAsset),
            fee: v1024.V3MultiAsset,
            dest: v1024.V3MultiLocation,
        })
    ),
}

export const transferredAssets =  {
    name: 'OrmlXTokens.TransferredAssets',
    /**
     * Transferred `Asset` with fee.
     */
    v1103: new EventType(
        'OrmlXTokens.TransferredAssets',
        sts.struct({
            sender: v1103.AccountId32,
            assets: sts.array(() => v1103.V4Asset),
            fee: v1103.V4Asset,
            dest: v1103.V4Location,
        })
    ),
}
