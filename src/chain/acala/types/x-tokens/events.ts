import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v2250 from '../v2250'

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
