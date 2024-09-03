import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v26 from '../v26'
import * as v34 from '../v34'
import * as v35 from '../v35'
import * as v42 from '../v42'

export const rewarded =  {
    name: 'ParachainStaking.Rewarded',
    /**
     *  Paid the account (nominator or collator) the balance as liquid rewards
     */
    v26: new EventType(
        'ParachainStaking.Rewarded',
        sts.tuple([v26.AccountId, v26.BalanceOf])
    ),
    /**
     * Paid the account (delegator or collator) the balance as liquid rewards.
     */
    v35: new EventType(
        'ParachainStaking.Rewarded',
        sts.struct({
            account: v35.AccountId32,
            rewards: sts.bigint(),
        })
    ),
}

export const candidateBondedMore =  {
    name: 'ParachainStaking.CandidateBondedMore',
    /**
     * Candidate, Amount, New Bond Total
     */
    v34: new EventType(
        'ParachainStaking.CandidateBondedMore',
        sts.tuple([v34.AccountId32, sts.bigint(), sts.bigint()])
    ),
    /**
     * Сandidate has increased a self bond.
     */
    v35: new EventType(
        'ParachainStaking.CandidateBondedMore',
        sts.struct({
            candidate: v35.AccountId32,
            amount: sts.bigint(),
            newTotalBond: sts.bigint(),
        })
    ),
}

export const candidateBondedLess =  {
    name: 'ParachainStaking.CandidateBondedLess',
    /**
     * Candidate, Amount, New Bond
     */
    v34: new EventType(
        'ParachainStaking.CandidateBondedLess',
        sts.tuple([v34.AccountId32, sts.bigint(), sts.bigint()])
    ),
    /**
     * Сandidate has decreased a self bond.
     */
    v35: new EventType(
        'ParachainStaking.CandidateBondedLess',
        sts.struct({
            candidate: v35.AccountId32,
            amount: sts.bigint(),
            newBond: sts.bigint(),
        })
    ),
}

export const candidateLeft =  {
    name: 'ParachainStaking.CandidateLeft',
    /**
     * Ex-Candidate, Amount Unlocked, New Total Amt Locked
     */
    v34: new EventType(
        'ParachainStaking.CandidateLeft',
        sts.tuple([v34.AccountId32, sts.bigint(), sts.bigint()])
    ),
    /**
     * Candidate has left the set of candidates.
     */
    v35: new EventType(
        'ParachainStaking.CandidateLeft',
        sts.struct({
            exCandidate: v35.AccountId32,
            unlockedAmount: sts.bigint(),
            newTotalAmtLocked: sts.bigint(),
        })
    ),
}

export const delegationIncreased =  {
    name: 'ParachainStaking.DelegationIncreased',
    v34: new EventType(
        'ParachainStaking.DelegationIncreased',
        sts.tuple([v34.AccountId32, v34.AccountId32, sts.bigint(), sts.boolean()])
    ),
    v35: new EventType(
        'ParachainStaking.DelegationIncreased',
        sts.struct({
            delegator: v35.AccountId32,
            candidate: v35.AccountId32,
            amount: sts.bigint(),
            inTop: sts.boolean(),
        })
    ),
}

export const delegationDecreased =  {
    name: 'ParachainStaking.DelegationDecreased',
    v34: new EventType(
        'ParachainStaking.DelegationDecreased',
        sts.tuple([v34.AccountId32, v34.AccountId32, sts.bigint(), sts.boolean()])
    ),
    v35: new EventType(
        'ParachainStaking.DelegationDecreased',
        sts.struct({
            delegator: v35.AccountId32,
            candidate: v35.AccountId32,
            amount: sts.bigint(),
            inTop: sts.boolean(),
        })
    ),
}

export const delegationRevoked =  {
    name: 'ParachainStaking.DelegationRevoked',
    /**
     * Delegator, Candidate, Amount Unstaked
     */
    v34: new EventType(
        'ParachainStaking.DelegationRevoked',
        sts.tuple([v34.AccountId32, v34.AccountId32, sts.bigint()])
    ),
    /**
     * Delegation revoked.
     */
    v35: new EventType(
        'ParachainStaking.DelegationRevoked',
        sts.struct({
            delegator: v35.AccountId32,
            candidate: v35.AccountId32,
            unstakedAmount: sts.bigint(),
        })
    ),
}

export const delegationKicked =  {
    name: 'ParachainStaking.DelegationKicked',
    /**
     * Delegator, Candidate, Amount Unstaked
     */
    v34: new EventType(
        'ParachainStaking.DelegationKicked',
        sts.tuple([v34.AccountId32, v34.AccountId32, sts.bigint()])
    ),
    /**
     * Delegation kicked.
     */
    v35: new EventType(
        'ParachainStaking.DelegationKicked',
        sts.struct({
            delegator: v35.AccountId32,
            candidate: v35.AccountId32,
            unstakedAmount: sts.bigint(),
        })
    ),
}

export const delegation =  {
    name: 'ParachainStaking.Delegation',
    /**
     * Delegator, Amount Locked, Candidate, Delegator Position with New Total Counted if in Top
     */
    v34: new EventType(
        'ParachainStaking.Delegation',
        sts.tuple([v34.AccountId32, sts.bigint(), v34.AccountId32, v34.DelegatorAdded])
    ),
    /**
     * New delegation (increase of the existing one).
     */
    v35: new EventType(
        'ParachainStaking.Delegation',
        sts.struct({
            delegator: v35.AccountId32,
            lockedAmount: sts.bigint(),
            candidate: v35.AccountId32,
            delegatorPosition: v35.DelegatorAdded,
        })
    ),
    /**
     * New delegation (increase of the existing one).
     */
    v42: new EventType(
        'ParachainStaking.Delegation',
        sts.struct({
            delegator: v42.AccountId32,
            lockedAmount: sts.bigint(),
            candidate: v42.AccountId32,
            delegatorPosition: v42.DelegatorAdded,
            autoCompound: v42.Percent,
        })
    ),
}

export const compounded =  {
    name: 'ParachainStaking.Compounded',
    /**
     * Compounded a portion of rewards towards the delegation.
     */
    v42: new EventType(
        'ParachainStaking.Compounded',
        sts.struct({
            candidate: v42.AccountId32,
            delegator: v42.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
