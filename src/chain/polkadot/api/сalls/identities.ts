import { Call } from '@subsquid/substrate-processor'
import { DataNotDecodableError, UnknownVersionError } from '../../../../utils'
import { calls } from '../../types'

const set_identity = {
    decode(call: Call) {
        const { setIdentity } = calls.identity
        if (setIdentity.v5.is(call)) {
            return setIdentity.v5.decode(call).info
        } else {
            throw new UnknownVersionError(setIdentity)
        }
    },
}

const set_subs = {
    decode(call: Call) {
        const { setSubs } = calls.identity
        if (setSubs.v5.is(call)) {
            return setSubs.v5.decode(call)
        } else {
            throw new UnknownVersionError(setSubs)
        }
    },
}

const provide_judgement = {
    decode(call: Call) {
        const { provideJudgement } = calls.identity
        if (provideJudgement.v5.is(call)) {
            return provideJudgement.v5.decode(call)
        } else if (provideJudgement.v28.is(call)) {
            const data = provideJudgement.v28.decode(call)
            if (data.target.__kind === 'Id') return { ...data, target: data.target.value }
            else throw new DataNotDecodableError(provideJudgement, data)
        } else if (provideJudgement.v9110.is(call)) {
            const data = provideJudgement.v9110.decode(call)
            if (data.target.__kind === 'Id') return { ...data, target: data.target.value }
            else throw new DataNotDecodableError(provideJudgement, data)
        } else if (provideJudgement.v9300.is(call)) {
            const data = provideJudgement.v9300.decode(call)
            if (data.target.__kind === 'Id') return { ...data, target: data.target.value }
            else throw new DataNotDecodableError(provideJudgement, data)
        } else {
            throw new UnknownVersionError(provideJudgement)
        }
    },
}

const add_sub = {
    decode(call: Call) {
        const { addSub } = calls.identity
        if (addSub.v15.is(call)) {
            return addSub.v15.decode(call)
        } else if (addSub.v28.is(call)) {
            const data = addSub.v28.decode(call)
            if (data.sub.__kind !== 'Index') return { ...data, sub: data.sub.value }
            else throw new DataNotDecodableError(addSub, data)
        } else if (addSub.v9110.is(call)) {
            const data = addSub.v9110.decode(call)
            if (data.sub.__kind !== 'Index') return { ...data, sub: data.sub.value }
            else throw new DataNotDecodableError(addSub, data)
        } else {
            throw new UnknownVersionError(addSub)
        }
    },
}

const rename_sub = {
    decode(call: Call) {
        const { renameSub } = calls.identity
        if (renameSub.v15.is(call)) {
            return renameSub.v15.decode(call)
        } else if (renameSub.v28.is(call)) {
            const data = renameSub.v28.decode(call)
            if (data.sub.__kind !== 'Index') return { ...data, sub: data.sub.value }
            else throw new DataNotDecodableError(renameSub, data)
        } else if (renameSub.v9110.is(call)) {
            const data = renameSub.v9110.decode(call)
            if (data.sub.__kind !== 'Index') return { ...data, sub: data.sub.value }
            else throw new DataNotDecodableError(renameSub, data)
        } else {
            throw new UnknownVersionError(renameSub)
        }
    },
}

// const clear_identity = {
//     decode(call: Call) {
//         let e = new IdentityClearIdentityCall(ctx, call)
//         if (e.isV1030) {
//             return e.asV1030
//         } else if (e.isV28) {
//             const data = e.asV28
//             if (data.sub.__kind !== 'Index') return {...data, sub: data.sub.value}
//             else throw new DataNotDecodableError(e, data)
//         } else if (e.isV9110) {
//             const data = e.asV9110
//             if (data.sub.__kind !== 'Index') return {...data, sub: data.sub.value}
//             else throw new DataNotDecodableError(e, data)
//         } else {
//             throw new UnknownVersionError(e)
//         }
//     },
// }

export default {
    set_identity,
    set_subs,
    add_sub,
    rename_sub,
    provide_judgement,
}
