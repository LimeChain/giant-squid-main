import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v15 from '../v15'
import * as v9140 from '../v9140'

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
