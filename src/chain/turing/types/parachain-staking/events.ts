import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v280 from '../v280'
import * as v293 from '../v293'

export const candidateBondedMore =  {
    name: 'ParachainStaking.CandidateBondedMore',
    /**
     * Candidate has increased a self bond.
     */
    v280: new EventType(
        'ParachainStaking.CandidateBondedMore',
        sts.struct({
            candidate: v280.AccountId32,
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
    v280: new EventType(
        'ParachainStaking.CandidateBondedLess',
        sts.struct({
            candidate: v280.AccountId32,
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
    v280: new EventType(
        'ParachainStaking.CandidateLeft',
        sts.struct({
            exCandidate: v280.AccountId32,
            unlockedAmount: sts.bigint(),
            newTotalAmtLocked: sts.bigint(),
        })
    ),
}

export const delegationIncreased =  {
    name: 'ParachainStaking.DelegationIncreased',
    v280: new EventType(
        'ParachainStaking.DelegationIncreased',
        sts.struct({
            delegator: v280.AccountId32,
            candidate: v280.AccountId32,
            amount: sts.bigint(),
            inTop: sts.boolean(),
        })
    ),
}

export const delegationDecreased =  {
    name: 'ParachainStaking.DelegationDecreased',
    v280: new EventType(
        'ParachainStaking.DelegationDecreased',
        sts.struct({
            delegator: v280.AccountId32,
            candidate: v280.AccountId32,
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
    v280: new EventType(
        'ParachainStaking.DelegationRevoked',
        sts.struct({
            delegator: v280.AccountId32,
            candidate: v280.AccountId32,
            unstakedAmount: sts.bigint(),
        })
    ),
}

export const delegationKicked =  {
    name: 'ParachainStaking.DelegationKicked',
    /**
     * Delegation kicked.
     */
    v280: new EventType(
        'ParachainStaking.DelegationKicked',
        sts.struct({
            delegator: v280.AccountId32,
            candidate: v280.AccountId32,
            unstakedAmount: sts.bigint(),
        })
    ),
}

export const delegation =  {
    name: 'ParachainStaking.Delegation',
    /**
     * New delegation (increase of the existing one).
     */
    v280: new EventType(
        'ParachainStaking.Delegation',
        sts.struct({
            delegator: v280.AccountId32,
            lockedAmount: sts.bigint(),
            candidate: v280.AccountId32,
            delegatorPosition: v280.DelegatorAdded,
        })
    ),
    /**
     * New delegation (increase of the existing one).
     */
    v293: new EventType(
        'ParachainStaking.Delegation',
        sts.struct({
            delegator: v293.AccountId32,
            lockedAmount: sts.bigint(),
            candidate: v293.AccountId32,
            delegatorPosition: v293.DelegatorAdded,
            autoCompound: v293.Percent,
        })
    ),
}

export const rewarded =  {
    name: 'ParachainStaking.Rewarded',
    /**
     * Paid the account (delegator or collator) the balance as liquid rewards.
     */
    v280: new EventType(
        'ParachainStaking.Rewarded',
        sts.struct({
            account: v280.AccountId32,
            rewards: sts.bigint(),
        })
    ),
}

export const compounded =  {
    name: 'ParachainStaking.Compounded',
    /**
     * Compounded a portion of rewards towards the delegation.
     */
    v293: new EventType(
        'ParachainStaking.Compounded',
        sts.struct({
            candidate: v293.AccountId32,
            delegator: v293.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
