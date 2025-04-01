import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v9420 from '../v9420'

export const delegate =  {
    name: 'ConvictionVoting.delegate',
    /**
     * Delegate the voting power (with some given conviction) of the sending account for a
     * particular class of polls.
     * 
     * The balance delegated is locked for as long as it's delegated, and thereafter for the
     * time appropriate for the conviction's lock period.
     * 
     * The dispatch origin of this call must be _Signed_, and the signing account must either:
     *   - be delegating already; or
     *   - have no voting activity (if there is, then it will need to be removed/consolidated
     *     through `reap_vote` or `unvote`).
     * 
     * - `to`: The account whose voting the `target` account's voting power will follow.
     * - `class`: The class of polls to delegate. To delegate multiple classes, multiple calls
     *   to this function are required.
     * - `conviction`: The conviction that will be attached to the delegated votes. When the
     *   account is undelegated, the funds will be locked for the corresponding period.
     * - `balance`: The amount of the account's balance to be used in delegating. This must not
     *   be more than the account's current balance.
     * 
     * Emits `Delegated`.
     * 
     * Weight: `O(R)` where R is the number of polls the voter delegating to has
     *   voted on. Weight is initially charged as if maximum votes, but is refunded later.
     */
    v9420: new CallType(
        'ConvictionVoting.delegate',
        sts.struct({
            class: sts.number(),
            to: v9420.MultiAddress,
            conviction: v9420.Type_153,
            balance: sts.bigint(),
        })
    ),
}

export const unlock =  {
    name: 'ConvictionVoting.unlock',
    /**
     * Remove the lock caused by prior voting/delegating which has expired within a particular
     * class.
     * 
     * The dispatch origin of this call must be _Signed_.
     * 
     * - `class`: The class of polls to unlock.
     * - `target`: The account to remove the lock on.
     * 
     * Weight: `O(R)` with R number of vote of target.
     */
    v9420: new CallType(
        'ConvictionVoting.unlock',
        sts.struct({
            class: sts.number(),
            target: v9420.MultiAddress,
        })
    ),
}
