import { calls } from '../../../types';
import { UnknownVersionError } from '../../../../../utils';
import { Call, ISetIdentityCallPalletDecoder } from '../../../../../indexer';

// TODO: fix return type
export class SetIdentityCallPalletDecoder implements ISetIdentityCallPalletDecoder {
  decode(call: Call): any {
    const { setIdentity } = calls.identity;
    if (setIdentity.v5.is(call)) {
      return setIdentity.v5.decode(call).info;
    } else {
      throw new UnknownVersionError(setIdentity);
    }
  }
}

// TODO: maybe remove?
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
