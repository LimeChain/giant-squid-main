import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v1 from '../v1'

export const payoutStakers =  {
    name: 'Staking.payout_stakers',
    /**
     * Pay out all the stakers behind a single validator for a single era.
     * 
     * - `validator_stash` is the stash account of the validator. Their nominators, up to
     *   `T::MaxNominatorRewardedPerValidator`, will also receive their rewards.
     * - `era` may be any era between `[current_era - history_depth; current_era]`.
     * 
     * The origin of this call must be _Signed_. Any account can call this function, even if
     * it is not one of the stakers.
     * 
     * # <weight>
     * - Time complexity: at most O(MaxNominatorRewardedPerValidator).
     * - Contains a limited number of reads and writes.
     * -----------
     * N is the Number of payouts for the validator (including the validator)
     * Weight:
     * - Reward Destination Staked: O(N)
     * - Reward Destination Controller (Creating): O(N)
     * 
     *   NOTE: weights are assuming that payouts are made to alive stash account (Staked).
     *   Paying even a dead controller is cheaper weight-wise. We don't do any refunds here.
     * # </weight>
     */
    v1: new CallType(
        'Staking.payout_stakers',
        sts.struct({
            validatorStash: v1.AccountId32,
            era: sts.number(),
        })
    ),
}
