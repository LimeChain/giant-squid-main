import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v2015 from '../v2015'
import * as v9130 from '../v9130'

export const subIdentityRemoved =  {
    name: 'Identity.SubIdentityRemoved',
    /**
     *  A sub-identity (first) was removed from an identity (second) and the deposit freed.
     */
    v2015: new EventType(
        'Identity.SubIdentityRemoved',
        sts.tuple([v2015.AccountId, v2015.AccountId, v2015.Balance])
    ),
    /**
     * A sub-identity was removed from an identity and the deposit freed.
     */
    v9130: new EventType(
        'Identity.SubIdentityRemoved',
        sts.struct({
            sub: v9130.AccountId32,
            main: v9130.AccountId32,
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
    v2015: new EventType(
        'Identity.SubIdentityRevoked',
        sts.tuple([v2015.AccountId, v2015.AccountId, v2015.Balance])
    ),
    /**
     * A sub-identity was cleared, and the given deposit repatriated from the
     * main identity account to the sub-identity account.
     */
    v9130: new EventType(
        'Identity.SubIdentityRevoked',
        sts.struct({
            sub: v9130.AccountId32,
            main: v9130.AccountId32,
            deposit: sts.bigint(),
        })
    ),
}
