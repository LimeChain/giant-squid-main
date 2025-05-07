import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v11000 from '../v11000'

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
