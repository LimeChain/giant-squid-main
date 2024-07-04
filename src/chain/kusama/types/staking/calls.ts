import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v1058 from '../v1058'

export const rebond =  {
    name: 'Staking.rebond',
    /**
     *  Rebond a portion of the stash scheduled to be unlocked.
     * 
     *  # <weight>
     *  - Time complexity: O(1). Bounded by `MAX_UNLOCKING_CHUNKS`.
     *  - Storage changes: Can't increase storage, only decrease it.
     *  # </weight>
     */
    v1038: new CallType(
        'Staking.rebond',
        sts.struct({
            value: sts.bigint(),
        })
    ),
}

export const payoutStakers =  {
    name: 'Staking.payout_stakers',
    /**
     *  Pay out all the stakers behind a single validator for a single era.
     * 
     *  - `validator_stash` is the stash account of the validator. Their nominators, up to
     *    `T::MaxNominatorRewardedPerValidator`, will also receive their rewards.
     *  - `era` may be any era between `[current_era - history_depth; current_era]`.
     * 
     *  The origin of this call must be _Signed_. Any account can call this function, even if
     *  it is not one of the stakers.
     * 
     *  This can only be called when [`EraElectionStatus`] is `Closed`.
     * 
     *  # <weight>
     *  - Time complexity: at most O(MaxNominatorRewardedPerValidator).
     *  - Contains a limited number of reads and writes.
     *  # </weight>
     */
    v1058: new CallType(
        'Staking.payout_stakers',
        sts.struct({
            validatorStash: v1058.AccountId,
            era: v1058.EraIndex,
        })
    ),
}
