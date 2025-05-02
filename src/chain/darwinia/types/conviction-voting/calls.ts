import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v6600 from '../v6600'

export const vote =  {
    name: 'ConvictionVoting.vote',
    /**
     * See [`Pallet::vote`].
     */
    v6600: new CallType(
        'ConvictionVoting.vote',
        sts.struct({
            pollIndex: sts.number(),
            vote: v6600.Type_121,
        })
    ),
}

export const unlock =  {
    name: 'ConvictionVoting.unlock',
    /**
     * See [`Pallet::unlock`].
     */
    v6600: new CallType(
        'ConvictionVoting.unlock',
        sts.struct({
            class: sts.number(),
            target: v6600.AccountId20,
        })
    ),
}

export const removeVote =  {
    name: 'ConvictionVoting.remove_vote',
    /**
     * See [`Pallet::remove_vote`].
     */
    v6600: new CallType(
        'ConvictionVoting.remove_vote',
        sts.struct({
            class: sts.option(() => sts.number()),
            index: sts.number(),
        })
    ),
}
