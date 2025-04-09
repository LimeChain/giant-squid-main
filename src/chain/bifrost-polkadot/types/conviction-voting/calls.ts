import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v982 from '../v982'

export const vote =  {
    name: 'ConvictionVoting.vote',
    /**
     * Vote in a poll. If `vote.is_aye()`, the vote is to enact the proposal;
     * otherwise it is a vote to keep the status quo.
     * 
     * The dispatch origin of this call must be _Signed_.
     * 
     * - `poll_index`: The index of the poll to vote for.
     * - `vote`: The vote configuration.
     * 
     * Weight: `O(R)` where R is the number of polls the voter has voted on.
     */
    v982: new CallType(
        'ConvictionVoting.vote',
        sts.struct({
            pollIndex: sts.number(),
            vote: v982.Type_101,
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
    v982: new CallType(
        'ConvictionVoting.unlock',
        sts.struct({
            class: sts.number(),
            target: v982.MultiAddress,
        })
    ),
}

export const removeVote =  {
    name: 'ConvictionVoting.remove_vote',
    /**
     * Remove a vote for a poll.
     * 
     * If:
     * - the poll was cancelled, or
     * - the poll is ongoing, or
     * - the poll has ended such that
     *   - the vote of the account was in opposition to the result; or
     *   - there was no conviction to the account's vote; or
     *   - the account made a split vote
     * ...then the vote is removed cleanly and a following call to `unlock` may result in more
     * funds being available.
     * 
     * If, however, the poll has ended and:
     * - it finished corresponding to the vote of the account, and
     * - the account made a standard vote with conviction, and
     * - the lock period of the conviction is not over
     * ...then the lock will be aggregated into the overall account's lock, which may involve
     * *overlocking* (where the two locks are combined into a single lock that is the maximum
     * of both the amount locked and the time is it locked for).
     * 
     * The dispatch origin of this call must be _Signed_, and the signer must have a vote
     * registered for poll `index`.
     * 
     * - `index`: The index of poll of the vote to be removed.
     * - `class`: Optional parameter, if given it indicates the class of the poll. For polls
     *   which have finished or are cancelled, this must be `Some`.
     * 
     * Weight: `O(R + log R)` where R is the number of polls that `target` has voted on.
     *   Weight is calculated for the maximum number of vote.
     */
    v982: new CallType(
        'ConvictionVoting.remove_vote',
        sts.struct({
            class: sts.option(() => sts.number()),
            index: sts.number(),
        })
    ),
}
