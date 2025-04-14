import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v117 from '../v117'

export const vote =  {
    name: 'ConvictionVoting.vote',
    /**
     * See [`Pallet::vote`].
     */
    v117: new CallType(
        'ConvictionVoting.vote',
        sts.struct({
            pollIndex: sts.number(),
            vote: v117.Type_194,
        })
    ),
}

export const unlock =  {
    name: 'ConvictionVoting.unlock',
    /**
     * See [`Pallet::unlock`].
     */
    v117: new CallType(
        'ConvictionVoting.unlock',
        sts.struct({
            class: sts.number(),
            target: v117.AccountId32,
        })
    ),
}

export const removeVote =  {
    name: 'ConvictionVoting.remove_vote',
    /**
     * See [`Pallet::remove_vote`].
     */
    v117: new CallType(
        'ConvictionVoting.remove_vote',
        sts.struct({
            class: sts.option(() => sts.number()),
            index: sts.number(),
        })
    ),
}
