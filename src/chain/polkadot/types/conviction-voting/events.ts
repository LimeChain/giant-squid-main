import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1004000 from '../v1004000'

export const voteRemoved =  {
    name: 'ConvictionVoting.VoteRemoved',
    /**
     * A vote that been removed
     */
    v1004000: new EventType(
        'ConvictionVoting.VoteRemoved',
        sts.struct({
            who: v1004000.AccountId32,
            vote: v1004000.AccountVote,
        })
    ),
}
