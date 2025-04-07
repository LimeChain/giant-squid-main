import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v9320 from '../v9320'
import * as v1004000 from '../v1004000'

export const delegated =  {
    name: 'ConvictionVoting.Delegated',
    /**
     * An account has delegated their vote to another account. \[who, target\]
     */
    v9320: new EventType(
        'ConvictionVoting.Delegated',
        sts.tuple([v9320.AccountId32, v9320.AccountId32])
    ),
}

export const undelegated =  {
    name: 'ConvictionVoting.Undelegated',
    /**
     * An \[account\] has cancelled a previous delegation operation.
     */
    v9320: new EventType(
        'ConvictionVoting.Undelegated',
        v9320.AccountId32
    ),
}

export const voted =  {
    name: 'ConvictionVoting.Voted',
    /**
     * An account that has voted
     */
    v1004000: new EventType(
        'ConvictionVoting.Voted',
        sts.struct({
            who: v1004000.AccountId32,
            vote: v1004000.AccountVote,
        })
    ),
}

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
