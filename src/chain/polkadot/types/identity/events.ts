import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v5 from '../v5'
import * as v15 from '../v15'
import * as v9140 from '../v9140'

export const identityCleared =  {
    name: 'Identity.IdentityCleared',
    /**
     *  A name was cleared, and the given balance returned.
     */
    v5: new EventType(
        'Identity.IdentityCleared',
        sts.tuple([v5.AccountId, v5.Balance])
    ),
    /**
     * A name was cleared, and the given balance returned.
     */
    v9140: new EventType(
        'Identity.IdentityCleared',
        sts.struct({
            who: v9140.AccountId32,
            deposit: sts.bigint(),
        })
    ),
}

export const identityKilled =  {
    name: 'Identity.IdentityKilled',
    /**
     *  A name was removed and the given balance slashed.
     */
    v5: new EventType(
        'Identity.IdentityKilled',
        sts.tuple([v5.AccountId, v5.Balance])
    ),
    /**
     * A name was removed and the given balance slashed.
     */
    v9140: new EventType(
        'Identity.IdentityKilled',
        sts.struct({
            who: v9140.AccountId32,
            deposit: sts.bigint(),
        })
    ),
}

export const subIdentityRemoved =  {
    name: 'Identity.SubIdentityRemoved',
    /**
     *  A sub-identity (first) was removed from an identity (second) and the deposit freed.
     */
    v15: new EventType(
        'Identity.SubIdentityRemoved',
        sts.tuple([v15.AccountId, v15.AccountId, v15.Balance])
    ),
    /**
     * A sub-identity was removed from an identity and the deposit freed.
     */
    v9140: new EventType(
        'Identity.SubIdentityRemoved',
        sts.struct({
            sub: v9140.AccountId32,
            main: v9140.AccountId32,
            deposit: sts.bigint(),
        })
    ),
}

export const subIdentityRevoked =  {
    name: 'Identity.SubIdentityRevoked',
    /**
     *  A sub-identity (first arg) was cleared, and the given deposit repatriated from the
     *  main identity account (second arg) to the sub-identity account.
     */
    v15: new EventType(
        'Identity.SubIdentityRevoked',
        sts.tuple([v15.AccountId, v15.AccountId, v15.Balance])
    ),
    /**
     * A sub-identity was cleared, and the given deposit repatriated from the
     * main identity account to the sub-identity account.
     */
    v9140: new EventType(
        'Identity.SubIdentityRevoked',
        sts.struct({
            sub: v9140.AccountId32,
            main: v9140.AccountId32,
            deposit: sts.bigint(),
        })
    ),
}
