import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v5 from '../v5'
import * as v15 from '../v15'
import * as v28 from '../v28'
import * as v9110 from '../v9110'
import * as v9300 from '../v9300'

export const setIdentity =  {
    name: 'Identity.set_identity',
    /**
     *  Set an account's identity information and reserve the appropriate deposit.
     * 
     *  If the account already has identity information, the deposit is taken as part payment
     *  for the new deposit.
     * 
     *  The dispatch origin for this call must be _Signed_.
     * 
     *  - `info`: The identity information.
     * 
     *  Emits `IdentitySet` if successful.
     * 
     *  # <weight>
     *  - `O(X + X' + R)`
     *    - where `X` additional-field-count (deposit-bounded and code-bounded)
     *    - where `R` judgements-count (registrar-count-bounded)
     *  - One balance reserve operation.
     *  - One storage mutation (codec-read `O(X' + R)`, codec-write `O(X + R)`).
     *  - One event.
     *  # </weight>
     */
    v5: new CallType(
        'Identity.set_identity',
        sts.struct({
            info: v5.IdentityInfo,
        })
    ),
}

export const setSubs =  {
    name: 'Identity.set_subs',
    /**
     *  Set the sub-accounts of the sender.
     * 
     *  Payment: Any aggregate balance reserved by previous `set_subs` calls will be returned
     *  and an amount `SubAccountDeposit` will be reserved for each item in `subs`.
     * 
     *  The dispatch origin for this call must be _Signed_ and the sender must have a registered
     *  identity.
     * 
     *  - `subs`: The identity's (new) sub-accounts.
     * 
     *  # <weight>
     *  - `O(P + S)`
     *    - where `P` old-subs-count (hard- and deposit-bounded).
     *    - where `S` subs-count (hard- and deposit-bounded).
     *  - At most one balance operations.
     *  - DB:
     *    - `P + S` storage mutations (codec complexity `O(1)`)
     *    - One storage read (codec complexity `O(P)`).
     *    - One storage write (codec complexity `O(S)`).
     *    - One storage-exists (`IdentityOf::contains_key`).
     *  # </weight>
     */
    v5: new CallType(
        'Identity.set_subs',
        sts.struct({
            subs: sts.array(() => sts.tuple(() => [v5.AccountId, v5.Data])),
        })
    ),
}

export const provideJudgement =  {
    name: 'Identity.provide_judgement',
    /**
     *  Provide a judgement for an account's identity.
     * 
     *  The dispatch origin for this call must be _Signed_ and the sender must be the account
     *  of the registrar whose index is `reg_index`.
     * 
     *  - `reg_index`: the index of the registrar whose judgement is being made.
     *  - `target`: the account whose identity the judgement is upon. This must be an account
     *    with a registered identity.
     *  - `judgement`: the judgement of the registrar of index `reg_index` about `target`.
     * 
     *  Emits `JudgementGiven` if successful.
     * 
     *  # <weight>
     *  - `O(R + X)`.
     *  - One balance-transfer operation.
     *  - Up to one account-lookup operation.
     *  - Storage: 1 read `O(R)`, 1 mutate `O(R + X)`.
     *  - One event.
     *  # </weight>
     */
    v5: new CallType(
        'Identity.provide_judgement',
        sts.struct({
            regIndex: sts.number(),
            target: v5.LookupSource,
            judgement: v5.IdentityJudgement,
        })
    ),
    /**
     *  Provide a judgement for an account's identity.
     * 
     *  The dispatch origin for this call must be _Signed_ and the sender must be the account
     *  of the registrar whose index is `reg_index`.
     * 
     *  - `reg_index`: the index of the registrar whose judgement is being made.
     *  - `target`: the account whose identity the judgement is upon. This must be an account
     *    with a registered identity.
     *  - `judgement`: the judgement of the registrar of index `reg_index` about `target`.
     * 
     *  Emits `JudgementGiven` if successful.
     * 
     *  # <weight>
     *  - `O(R + X)`.
     *  - One balance-transfer operation.
     *  - Up to one account-lookup operation.
     *  - Storage: 1 read `O(R)`, 1 mutate `O(R + X)`.
     *  - One event.
     *  # </weight>
     */
    v28: new CallType(
        'Identity.provide_judgement',
        sts.struct({
            regIndex: sts.number(),
            target: v28.LookupSource,
            judgement: v28.IdentityJudgement,
        })
    ),
    /**
     * Provide a judgement for an account's identity.
     * 
     * The dispatch origin for this call must be _Signed_ and the sender must be the account
     * of the registrar whose index is `reg_index`.
     * 
     * - `reg_index`: the index of the registrar whose judgement is being made.
     * - `target`: the account whose identity the judgement is upon. This must be an account
     *   with a registered identity.
     * - `judgement`: the judgement of the registrar of index `reg_index` about `target`.
     * 
     * Emits `JudgementGiven` if successful.
     * 
     * # <weight>
     * - `O(R + X)`.
     * - One balance-transfer operation.
     * - Up to one account-lookup operation.
     * - Storage: 1 read `O(R)`, 1 mutate `O(R + X)`.
     * - One event.
     * # </weight>
     */
    v9110: new CallType(
        'Identity.provide_judgement',
        sts.struct({
            regIndex: sts.number(),
            target: v9110.MultiAddress,
            judgement: v9110.Judgement,
        })
    ),
    /**
     * Provide a judgement for an account's identity.
     * 
     * The dispatch origin for this call must be _Signed_ and the sender must be the account
     * of the registrar whose index is `reg_index`.
     * 
     * - `reg_index`: the index of the registrar whose judgement is being made.
     * - `target`: the account whose identity the judgement is upon. This must be an account
     *   with a registered identity.
     * - `judgement`: the judgement of the registrar of index `reg_index` about `target`.
     * - `identity`: The hash of the [`IdentityInfo`] for that the judgement is provided.
     * 
     * Emits `JudgementGiven` if successful.
     * 
     * # <weight>
     * - `O(R + X)`.
     * - One balance-transfer operation.
     * - Up to one account-lookup operation.
     * - Storage: 1 read `O(R)`, 1 mutate `O(R + X)`.
     * - One event.
     * # </weight>
     */
    v9300: new CallType(
        'Identity.provide_judgement',
        sts.struct({
            regIndex: sts.number(),
            target: v9300.MultiAddress,
            judgement: v9300.Judgement,
            identity: v9300.H256,
        })
    ),
}

export const addSub =  {
    name: 'Identity.add_sub',
    /**
     *  Add the given account to the sender's subs.
     * 
     *  Payment: Balance reserved by a previous `set_subs` call for one sub will be repatriated
     *  to the sender.
     * 
     *  The dispatch origin for this call must be _Signed_ and the sender must have a registered
     *  sub identity of `sub`.
     */
    v15: new CallType(
        'Identity.add_sub',
        sts.struct({
            sub: v15.LookupSource,
            data: v15.Data,
        })
    ),
    /**
     *  Add the given account to the sender's subs.
     * 
     *  Payment: Balance reserved by a previous `set_subs` call for one sub will be repatriated
     *  to the sender.
     * 
     *  The dispatch origin for this call must be _Signed_ and the sender must have a registered
     *  sub identity of `sub`.
     */
    v28: new CallType(
        'Identity.add_sub',
        sts.struct({
            sub: v28.LookupSource,
            data: v28.Data,
        })
    ),
    /**
     * Add the given account to the sender's subs.
     * 
     * Payment: Balance reserved by a previous `set_subs` call for one sub will be repatriated
     * to the sender.
     * 
     * The dispatch origin for this call must be _Signed_ and the sender must have a registered
     * sub identity of `sub`.
     */
    v9110: new CallType(
        'Identity.add_sub',
        sts.struct({
            sub: v9110.MultiAddress,
            data: v9110.Data,
        })
    ),
}

export const renameSub =  {
    name: 'Identity.rename_sub',
    /**
     *  Alter the associated name of the given sub-account.
     * 
     *  The dispatch origin for this call must be _Signed_ and the sender must have a registered
     *  sub identity of `sub`.
     */
    v15: new CallType(
        'Identity.rename_sub',
        sts.struct({
            sub: v15.LookupSource,
            data: v15.Data,
        })
    ),
    /**
     *  Alter the associated name of the given sub-account.
     * 
     *  The dispatch origin for this call must be _Signed_ and the sender must have a registered
     *  sub identity of `sub`.
     */
    v28: new CallType(
        'Identity.rename_sub',
        sts.struct({
            sub: v28.LookupSource,
            data: v28.Data,
        })
    ),
    /**
     * Alter the associated name of the given sub-account.
     * 
     * The dispatch origin for this call must be _Signed_ and the sender must have a registered
     * sub identity of `sub`.
     */
    v9110: new CallType(
        'Identity.rename_sub',
        sts.struct({
            sub: v9110.MultiAddress,
            data: v9110.Data,
        })
    ),
}
