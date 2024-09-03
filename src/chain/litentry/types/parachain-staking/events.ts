import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v9100 from '../v9100'
import * as v9135 from '../v9135'

export const candidateBondedMore =  {
    name: 'ParachainStaking.CandidateBondedMore',
    /**
     * Candidate has increased a self bond.
     */
    v9100: new EventType(
        'ParachainStaking.CandidateBondedMore',
        sts.struct({
            candidate: v9100.AccountId32,
            amount: sts.bigint(),
            newTotalBond: sts.bigint(),
        })
    ),
}

export const candidateBondedLess =  {
    name: 'ParachainStaking.CandidateBondedLess',
    /**
     * Candidate has decreased a self bond.
     */
    v9100: new EventType(
        'ParachainStaking.CandidateBondedLess',
        sts.struct({
            candidate: v9100.AccountId32,
            amount: sts.bigint(),
            newBond: sts.bigint(),
        })
    ),
}

export const candidateLeft =  {
    name: 'ParachainStaking.CandidateLeft',
    /**
     * Candidate has left the set of candidates.
     */
    v9100: new EventType(
        'ParachainStaking.CandidateLeft',
        sts.struct({
            exCandidate: v9100.AccountId32,
            unlockedAmount: sts.bigint(),
            newTotalAmtLocked: sts.bigint(),
        })
    ),
}

export const delegationIncreased =  {
    name: 'ParachainStaking.DelegationIncreased',
    v9100: new EventType(
        'ParachainStaking.DelegationIncreased',
        sts.struct({
            delegator: v9100.AccountId32,
            candidate: v9100.AccountId32,
            amount: sts.bigint(),
            inTop: sts.boolean(),
        })
    ),
}

export const delegationDecreased =  {
    name: 'ParachainStaking.DelegationDecreased',
    v9100: new EventType(
        'ParachainStaking.DelegationDecreased',
        sts.struct({
            delegator: v9100.AccountId32,
            candidate: v9100.AccountId32,
            amount: sts.bigint(),
            inTop: sts.boolean(),
        })
    ),
}

export const delegationRevoked =  {
    name: 'ParachainStaking.DelegationRevoked',
    /**
     * Delegation revoked.
     */
    v9100: new EventType(
        'ParachainStaking.DelegationRevoked',
        sts.struct({
            delegator: v9100.AccountId32,
            candidate: v9100.AccountId32,
            unstakedAmount: sts.bigint(),
        })
    ),
}

export const delegationKicked =  {
    name: 'ParachainStaking.DelegationKicked',
    /**
     * Delegation kicked.
     */
    v9100: new EventType(
        'ParachainStaking.DelegationKicked',
        sts.struct({
            delegator: v9100.AccountId32,
            candidate: v9100.AccountId32,
            unstakedAmount: sts.bigint(),
        })
    ),
}

export const delegation =  {
    name: 'ParachainStaking.Delegation',
    /**
     * New delegation (increase of the existing one).
     */
    v9100: new EventType(
        'ParachainStaking.Delegation',
        sts.struct({
            delegator: v9100.AccountId32,
            lockedAmount: sts.bigint(),
            candidate: v9100.AccountId32,
            delegatorPosition: v9100.DelegatorAdded,
        })
    ),
    /**
     * New delegation (increase of the existing one).
     */
    v9135: new EventType(
        'ParachainStaking.Delegation',
        sts.struct({
            delegator: v9135.AccountId32,
            lockedAmount: sts.bigint(),
            candidate: v9135.AccountId32,
            delegatorPosition: v9135.DelegatorAdded,
            autoCompound: v9135.Percent,
        })
    ),
}

export const rewarded =  {
    name: 'ParachainStaking.Rewarded',
    /**
     * Paid the account (delegator or collator) the balance as liquid rewards.
     */
    v9100: new EventType(
        'ParachainStaking.Rewarded',
        sts.struct({
            account: v9100.AccountId32,
            rewards: sts.bigint(),
        })
    ),
}

export const compounded =  {
    name: 'ParachainStaking.Compounded',
    /**
     * Compounded a portion of rewards towards the delegation.
     */
    v9135: new EventType(
        'ParachainStaking.Compounded',
        sts.struct({
            candidate: v9135.AccountId32,
            delegator: v9135.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
