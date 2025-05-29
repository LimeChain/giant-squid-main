import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v16 from '../v16'
import * as v19 from '../v19'
import * as v25 from '../v25'
import * as v101 from '../v101'
import * as v115 from '../v115'

export const transfer =  {
    name: 'XTokens.transfer',
    /**
     *  Transfer native currencies.
     * 
     *  `dest_weight` is the weight for XCM execution on the dest chain, and
     *  it would be charged from the transferred assets. If set below
     *  requirements, the execution may fail and assets wouldn't be
     *  received.
     * 
     *  It's a no-op if any error on local XCM execution or message sending.
     *  Note sending assets out per se doesn't guarantee they would be
     *  received. Receiving depends on if the XCM message could be delivered
     *  by the network, and if the receiving chain would handle
     *  messages correctly.
     */
    v16: new CallType(
        'XTokens.transfer',
        sts.struct({
            currencyId: v16.CurrencyId,
            amount: v16.Balance,
            dest: v16.MultiLocation,
            destWeight: v16.Weight,
        })
    ),
    /**
     *  Transfer native currencies.
     * 
     *  `dest_weight` is the weight for XCM execution on the dest chain, and
     *  it would be charged from the transferred assets. If set below
     *  requirements, the execution may fail and assets wouldn't be
     *  received.
     * 
     *  It's a no-op if any error on local XCM execution or message sending.
     *  Note sending assets out per se doesn't guarantee they would be
     *  received. Receiving depends on if the XCM message could be delivered
     *  by the network, and if the receiving chain would handle
     *  messages correctly.
     */
    v19: new CallType(
        'XTokens.transfer',
        sts.struct({
            currencyId: v19.CurrencyId,
            amount: v19.Balance,
            dest: v19.MultiLocation,
            destWeight: v19.Weight,
        })
    ),
    /**
     * Transfer native currencies.
     * 
     * `dest_weight` is the weight for XCM execution on the dest chain, and
     * it would be charged from the transferred assets. If set below
     * requirements, the execution may fail and assets wouldn't be
     * received.
     * 
     * It's a no-op if any error on local XCM execution or message sending.
     * Note sending assets out per se doesn't guarantee they would be
     * received. Receiving depends on if the XCM message could be delivered
     * by the network, and if the receiving chain would handle
     * messages correctly.
     */
    v25: new CallType(
        'XTokens.transfer',
        sts.struct({
            currencyId: sts.number(),
            amount: sts.bigint(),
            dest: v25.VersionedMultiLocation,
            destWeight: sts.bigint(),
        })
    ),
    /**
     * Transfer native currencies.
     * 
     * `dest_weight_limit` is the weight for XCM execution on the dest
     * chain, and it would be charged from the transferred assets. If set
     * below requirements, the execution may fail and assets wouldn't be
     * received.
     * 
     * It's a no-op if any error on local XCM execution or message sending.
     * Note sending assets out per se doesn't guarantee they would be
     * received. Receiving depends on if the XCM message could be delivered
     * by the network, and if the receiving chain would handle
     * messages correctly.
     */
    v101: new CallType(
        'XTokens.transfer',
        sts.struct({
            currencyId: sts.number(),
            amount: sts.bigint(),
            dest: v101.VersionedMultiLocation,
            destWeightLimit: v101.V3WeightLimit,
        })
    ),
    /**
     * See [`Pallet::transfer`].
     */
    v115: new CallType(
        'XTokens.transfer',
        sts.struct({
            currencyId: sts.number(),
            amount: sts.bigint(),
            dest: v115.VersionedLocation,
            destWeightLimit: v115.V3WeightLimit,
        })
    ),
}
