import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v130 from '../v130'

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
}
