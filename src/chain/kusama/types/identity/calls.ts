import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v1030 from '../v1030'
import * as v1032 from '../v1032'
import * as v1050 from '../v1050'
import * as v2015 from '../v2015'
import * as v2028 from '../v2028'
import * as v9111 from '../v9111'
import * as v9300 from '../v9300'

export const setIdentity =  {
    name: 'Identity.set_identity',
    /**
     *  Set an account's identity information and reserve the appropriate deposit.
     * 
     *  If the account already has identity information, the deposit is taken as part payment
     *  for the new deposit.
     * 
     *  The dispatch origin for this call must be _Signed_ and the sender must have a registered
     *  identity.
     * 
     *  - `info`: The identity information.
     * 
     *  Emits `IdentitySet` if successful.
     * 
     *  # <weight>
     *  - `O(X + R)` where `X` additional-field-count (deposit-bounded).
     *  - At most two balance operations.
     *  - One storage mutation (codec `O(X + R)`).
     *  - One event.
     *  # </weight>
     */
    v1030: new CallType(
        'Identity.set_identity',
        sts.struct({
            info: v1030.IdentityInfo,
        })
    ),
    /**
     *  Set an account's identity information and reserve the appropriate deposit.
     * 
     *  If the account already has identity information, the deposit is taken as part payment
     *  for the new deposit.
     * 
     *  The dispatch origin for this call must be _Signed_ and the sender must have a registered
     *  identity.
     * 
     *  - `info`: The identity information.
     * 
     *  Emits `IdentitySet` if successful.
     * 
     *  # <weight>
     *  - `O(X + R)` where `X` additional-field-count (deposit-bounded).
     *  - At most two balance operations.
     *  - One storage mutation (codec `O(X + R)`).
     *  - One event.
     *  # </weight>
     */
    v1032: new CallType(
        'Identity.set_identity',
        sts.struct({
            info: v1032.IdentityInfo,
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
     *  - `subs`: The identity's sub-accounts.
     * 
     *  # <weight>
     *  - `O(S)` where `S` subs-count (hard- and deposit-bounded).
     *  - At most two balance operations.
     *  - One storage mutation (codec `O(S)`); one storage-exists.
     *  # </weight>
     */
    v1030: new CallType(
        'Identity.set_subs',
        sts.struct({
            subs: sts.array(() => sts.tuple(() => [v1030.AccountId, v1030.Data])),
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
    v1030: new CallType(
        'Identity.provide_judgement',
        sts.struct({
            regIndex: sts.number(),
            target: v1030.LookupSource,
            judgement: v1030.IdentityJudgement,
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
    v1050: new CallType(
        'Identity.provide_judgement',
        sts.struct({
            regIndex: sts.number(),
            target: v1050.LookupSource,
            judgement: v1050.IdentityJudgement,
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
    v2028: new CallType(
        'Identity.provide_judgement',
        sts.struct({
            regIndex: sts.number(),
            target: v2028.LookupSource,
            judgement: v2028.IdentityJudgement,
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
    v9111: new CallType(
        'Identity.provide_judgement',
        sts.struct({
            regIndex: sts.number(),
            target: v9111.MultiAddress,
            judgement: v9111.Judgement,
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
    v2015: new CallType(
        'Identity.add_sub',
        sts.struct({
            sub: v2015.LookupSource,
            data: v2015.Data,
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
    v2028: new CallType(
        'Identity.add_sub',
        sts.struct({
            sub: v2028.LookupSource,
            data: v2028.Data,
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
    v9111: new CallType(
        'Identity.add_sub',
        sts.struct({
            sub: v9111.MultiAddress,
            data: v9111.Data,
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
    v2015: new CallType(
        'Identity.rename_sub',
        sts.struct({
            sub: v2015.LookupSource,
            data: v2015.Data,
        })
    ),
    /**
     *  Alter the associated name of the given sub-account.
     * 
     *  The dispatch origin for this call must be _Signed_ and the sender must have a registered
     *  sub identity of `sub`.
     */
    v2028: new CallType(
        'Identity.rename_sub',
        sts.struct({
            sub: v2028.LookupSource,
            data: v2028.Data,
        })
    ),
    /**
     * Alter the associated name of the given sub-account.
     * 
     * The dispatch origin for this call must be _Signed_ and the sender must have a registered
     * sub identity of `sub`.
     */
    v9111: new CallType(
        'Identity.rename_sub',
        sts.struct({
            sub: v9111.MultiAddress,
            data: v9111.Data,
        })
    ),
}
