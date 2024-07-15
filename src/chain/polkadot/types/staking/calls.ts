import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v0 from '../v0'
import * as v28 from '../v28'
import * as v9110 from '../v9110'
import * as v9430 from '../v9430'

export const bond =  {
    name: 'Staking.bond',
    /**
     *  Take the origin account as a stash and lock up `value` of its balance. `controller` will
     *  be the account that controls it.
     * 
     *  `value` must be more than the `minimum_balance` specified by `T::Currency`.
     * 
     *  The dispatch origin for this call must be _Signed_ by the stash account.
     * 
     *  Emits `Bonded`.
     * 
     *  # <weight>
     *  - Independent of the arguments. Moderate complexity.
     *  - O(1).
     *  - Three extra DB entries.
     * 
     *  NOTE: Two of the storage writes (`Self::bonded`, `Self::payee`) are _never_ cleaned
     *  unless the `origin` falls below _existential deposit_ and gets removed as dust.
     *  ------------------
     *  Base Weight: 67.87 µs
     *  DB Weight:
     *  - Read: Bonded, Ledger, [Origin Account], Current Era, History Depth, Locks
     *  - Write: Bonded, Payee, [Origin Account], Locks, Ledger
     *  # </weight>
     */
    v0: new CallType(
        'Staking.bond',
        sts.struct({
            controller: v0.LookupSource,
            value: sts.bigint(),
            payee: v0.RewardDestination,
        })
    ),
    /**
     *  Take the origin account as a stash and lock up `value` of its balance. `controller` will
     *  be the account that controls it.
     * 
     *  `value` must be more than the `minimum_balance` specified by `T::Currency`.
     * 
     *  The dispatch origin for this call must be _Signed_ by the stash account.
     * 
     *  Emits `Bonded`.
     * 
     *  # <weight>
     *  - Independent of the arguments. Moderate complexity.
     *  - O(1).
     *  - Three extra DB entries.
     * 
     *  NOTE: Two of the storage writes (`Self::bonded`, `Self::payee`) are _never_ cleaned
     *  unless the `origin` falls below _existential deposit_ and gets removed as dust.
     *  ------------------
     *  Weight: O(1)
     *  DB Weight:
     *  - Read: Bonded, Ledger, [Origin Account], Current Era, History Depth, Locks
     *  - Write: Bonded, Payee, [Origin Account], Locks, Ledger
     *  # </weight>
     */
    v28: new CallType(
        'Staking.bond',
        sts.struct({
            controller: v28.LookupSource,
            value: sts.bigint(),
            payee: v28.RewardDestination,
        })
    ),
    /**
     * Take the origin account as a stash and lock up `value` of its balance. `controller` will
     * be the account that controls it.
     * 
     * `value` must be more than the `minimum_balance` specified by `T::Currency`.
     * 
     * The dispatch origin for this call must be _Signed_ by the stash account.
     * 
     * Emits `Bonded`.
     * # <weight>
     * - Independent of the arguments. Moderate complexity.
     * - O(1).
     * - Three extra DB entries.
     * 
     * NOTE: Two of the storage writes (`Self::bonded`, `Self::payee`) are _never_ cleaned
     * unless the `origin` falls below _existential deposit_ and gets removed as dust.
     * ------------------
     * # </weight>
     */
    v9110: new CallType(
        'Staking.bond',
        sts.struct({
            controller: v9110.MultiAddress,
            value: sts.bigint(),
            payee: v9110.RewardDestination,
        })
    ),
    /**
     * Take the origin account as a stash and lock up `value` of its balance. `controller` will
     * be the account that controls it.
     * 
     * `value` must be more than the `minimum_balance` specified by `T::Currency`.
     * 
     * The dispatch origin for this call must be _Signed_ by the stash account.
     * 
     * Emits `Bonded`.
     * ## Complexity
     * - Independent of the arguments. Moderate complexity.
     * - O(1).
     * - Three extra DB entries.
     * 
     * NOTE: Two of the storage writes (`Self::bonded`, `Self::payee`) are _never_ cleaned
     * unless the `origin` falls below _existential deposit_ and gets removed as dust.
     */
    v9430: new CallType(
        'Staking.bond',
        sts.struct({
            value: sts.bigint(),
            payee: v9430.RewardDestination,
        })
    ),
}

export const bondExtra =  {
    name: 'Staking.bond_extra',
    /**
     *  Add some extra amount that have appeared in the stash `free_balance` into the balance up
     *  for staking.
     * 
     *  Use this if there are additional funds in your stash account that you wish to bond.
     *  Unlike [`bond`] or [`unbond`] this function does not impose any limitation on the amount
     *  that can be added.
     * 
     *  The dispatch origin for this call must be _Signed_ by the stash, not the controller and
     *  it can be only called when [`EraElectionStatus`] is `Closed`.
     * 
     *  Emits `Bonded`.
     * 
     *  # <weight>
     *  - Independent of the arguments. Insignificant complexity.
     *  - O(1).
     *  - One DB entry.
     *  ------------
     *  Base Weight: 54.88 µs
     *  DB Weight:
     *  - Read: Era Election Status, Bonded, Ledger, [Origin Account], Locks
     *  - Write: [Origin Account], Locks, Ledger
     *  # </weight>
     */
    v0: new CallType(
        'Staking.bond_extra',
        sts.struct({
            maxAdditional: sts.bigint(),
        })
    ),
}

export const unbond =  {
    name: 'Staking.unbond',
    /**
     *  Schedule a portion of the stash to be unlocked ready for transfer out after the bond
     *  period ends. If this leaves an amount actively bonded less than
     *  T::Currency::minimum_balance(), then it is increased to the full amount.
     * 
     *  Once the unlock period is done, you can call `withdraw_unbonded` to actually move
     *  the funds out of management ready for transfer.
     * 
     *  No more than a limited number of unlocking chunks (see `MAX_UNLOCKING_CHUNKS`)
     *  can co-exists at the same time. In that case, [`Call::withdraw_unbonded`] need
     *  to be called first to remove some of the chunks (if possible).
     * 
     *  The dispatch origin for this call must be _Signed_ by the controller, not the stash.
     *  And, it can be only called when [`EraElectionStatus`] is `Closed`.
     * 
     *  Emits `Unbonded`.
     * 
     *  See also [`Call::withdraw_unbonded`].
     * 
     *  # <weight>
     *  - Independent of the arguments. Limited but potentially exploitable complexity.
     *  - Contains a limited number of reads.
     *  - Each call (requires the remainder of the bonded balance to be above `minimum_balance`)
     *    will cause a new entry to be inserted into a vector (`Ledger.unlocking`) kept in storage.
     *    The only way to clean the aforementioned storage item is also user-controlled via
     *    `withdraw_unbonded`.
     *  - One DB entry.
     *  ----------
     *  Base Weight: 50.34 µs
     *  DB Weight:
     *  - Read: Era Election Status, Ledger, Current Era, Locks, [Origin Account]
     *  - Write: [Origin Account], Locks, Ledger
     *  </weight>
     */
    v0: new CallType(
        'Staking.unbond',
        sts.struct({
            value: sts.bigint(),
        })
    ),
}

export const setPayee =  {
    name: 'Staking.set_payee',
    /**
     *  (Re-)set the payment target for a controller.
     * 
     *  Effects will be felt at the beginning of the next era.
     * 
     *  The dispatch origin for this call must be _Signed_ by the controller, not the stash.
     * 
     *  # <weight>
     *  - Independent of the arguments. Insignificant complexity.
     *  - Contains a limited number of reads.
     *  - Writes are limited to the `origin` account key.
     *  ---------
     *  - Base Weight: 11.33 µs
     *  - DB Weight:
     *      - Read: Ledger
     *      - Write: Payee
     *  # </weight>
     */
    v0: new CallType(
        'Staking.set_payee',
        sts.struct({
            payee: v0.RewardDestination,
        })
    ),
}

export const setController =  {
    name: 'Staking.set_controller',
    /**
     *  (Re-)set the controller of a stash.
     * 
     *  Effects will be felt at the beginning of the next era.
     * 
     *  The dispatch origin for this call must be _Signed_ by the stash, not the controller.
     * 
     *  # <weight>
     *  - Independent of the arguments. Insignificant complexity.
     *  - Contains a limited number of reads.
     *  - Writes are limited to the `origin` account key.
     *  ----------
     *  Base Weight: 25.22 µs
     *  DB Weight:
     *  - Read: Bonded, Ledger New Controller, Ledger Old Controller
     *  - Write: Bonded, Ledger New Controller, Ledger Old Controller
     *  # </weight>
     */
    v0: new CallType(
        'Staking.set_controller',
        sts.struct({
            controller: v0.LookupSource,
        })
    ),
    /**
     *  (Re-)set the controller of a stash.
     * 
     *  Effects will be felt at the beginning of the next era.
     * 
     *  The dispatch origin for this call must be _Signed_ by the stash, not the controller.
     * 
     *  # <weight>
     *  - Independent of the arguments. Insignificant complexity.
     *  - Contains a limited number of reads.
     *  - Writes are limited to the `origin` account key.
     *  ----------
     *  Weight: O(1)
     *  DB Weight:
     *  - Read: Bonded, Ledger New Controller, Ledger Old Controller
     *  - Write: Bonded, Ledger New Controller, Ledger Old Controller
     *  # </weight>
     */
    v28: new CallType(
        'Staking.set_controller',
        sts.struct({
            controller: v28.LookupSource,
        })
    ),
    /**
     * (Re-)set the controller of a stash.
     * 
     * Effects will be felt at the beginning of the next era.
     * 
     * The dispatch origin for this call must be _Signed_ by the stash, not the controller.
     * 
     * # <weight>
     * - Independent of the arguments. Insignificant complexity.
     * - Contains a limited number of reads.
     * - Writes are limited to the `origin` account key.
     * ----------
     * Weight: O(1)
     * DB Weight:
     * - Read: Bonded, Ledger New Controller, Ledger Old Controller
     * - Write: Bonded, Ledger New Controller, Ledger Old Controller
     * # </weight>
     */
    v9110: new CallType(
        'Staking.set_controller',
        sts.struct({
            controller: v9110.MultiAddress,
        })
    ),
    /**
     * (Re-)sets the controller of a stash to the stash itself. This function previously
     * accepted a `controller` argument to set the controller to an account other than the
     * stash itself. This functionality has now been removed, now only setting the controller
     * to the stash, if it is not already.
     * 
     * Effects will be felt instantly (as soon as this function is completed successfully).
     * 
     * The dispatch origin for this call must be _Signed_ by the stash, not the controller.
     * 
     * ## Complexity
     * O(1)
     * - Independent of the arguments. Insignificant complexity.
     * - Contains a limited number of reads.
     * - Writes are limited to the `origin` account key.
     */
    v9430: new CallType(
        'Staking.set_controller',
        sts.unit()
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
     *  -----------
     *  N is the Number of payouts for the validator (including the validator)
     *  Base Weight: 110 + 54.2 * N µs (Median Slopes)
     *  DB Weight:
     *  - Read: EraElectionStatus, CurrentEra, HistoryDepth, MigrateEra, ErasValidatorReward,
     *          ErasStakersClipped, ErasRewardPoints, ErasValidatorPrefs (8 items)
     *  - Read Each: Bonded, Ledger, Payee, Locks, System Account (5 items)
     *  - Write Each: System Account, Locks, Ledger (3 items)
     *  # </weight>
     */
    v0: new CallType(
        'Staking.payout_stakers',
        sts.struct({
            validatorStash: v0.AccountId,
            era: v0.EraIndex,
        })
    ),
}

export const rebond =  {
    name: 'Staking.rebond',
    /**
     *  Rebond a portion of the stash scheduled to be unlocked.
     * 
     *  The dispatch origin must be signed by the controller, and it can be only called when
     *  [`EraElectionStatus`] is `Closed`.
     * 
     *  # <weight>
     *  - Time complexity: O(L), where L is unlocking chunks
     *  - Bounded by `MAX_UNLOCKING_CHUNKS`.
     *  - Storage changes: Can't increase storage, only decrease it.
     *  ---------------
     *  - Base Weight: 34.51 µs * .048 L µs
     *  - DB Weight:
     *      - Reads: EraElectionStatus, Ledger, Locks, [Origin Account]
     *      - Writes: [Origin Account], Locks, Ledger
     *  # </weight>
     */
    v0: new CallType(
        'Staking.rebond',
        sts.struct({
            value: sts.bigint(),
        })
    ),
}
