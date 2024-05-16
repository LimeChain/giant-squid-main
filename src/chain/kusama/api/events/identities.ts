import { Event } from '../../../../processor';
import { UnknownVersionError } from '../../../../utils'
import { events } from '../../types'
// import {
//     IdentityIdentityClearedEvent,
//     IdentityIdentityKilledEvent,
//     IdentityIdentitySubRemovedEvent,
//     IdentityIdentitySubRevokedEvent,
// } from '../../types/events'
// import {ChainContext, Event} from '../../types/support'

// const IdentityCleared = {
//     decode(ctx: ChainContext, event: Event) {
//         let e = new IdentityIdentityClearedEvent(ctx, event)
//         if (e.isV1030) {
//             const [who, deposit] = e.asV1030
//             return {who, deposit}
//         } else if (e.isV9130) {
//             return e.asV9130
//         } else {
//             throw new UnknownVersionError(e)
//         }
//     },
// }

// const IdentityKilled = {
//     decode(ctx: ChainContext, event: Event) {
//         let e = new IdentityIdentityKilledEvent(ctx, event)
//         if (e.isV1030) {
//             const [who, deposit] = e.asV1030
//             return {who, deposit}
//         } else if (e.isV9130) {
//             return e.asV9130
//         } else {
//             throw new UnknownVersionError(e)
//         }
//     },
// }

const IdentitySubRemoved = {
    decode(event: Event) {
        const identity = events.identity.subIdentityRemoved;

        if (identity.v2015.is(event)) {
            const [sub, main, deposit] = identity.v2015.decode(event)
            return { sub, main, deposit }
        } else if (identity.v9130.is(event)) {
            return identity.v9130.decode(event)
        } else {
            throw new UnknownVersionError(identity)
        }
    },
}

const IdentitySubRevoked = {
    decode(event: Event) {
        const identity = events.identity.subIdentityRevoked;
        if (identity.v2015.is(event)) {
            const [sub, main, deposit] = identity.v2015.decode(event)
            return { sub, main, deposit }
        } else if (identity.v9130.is(event)) {
            return identity.v9130.decode(event)
        } else {
            throw new UnknownVersionError(identity)
        }
    },
}

export default {
    // IdentityCleared,
    // IdentityKilled,
    IdentitySubRemoved,
    IdentitySubRevoked,
}
