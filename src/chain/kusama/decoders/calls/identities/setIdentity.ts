import { IIdentitySetIdentityCallPalletDecoder } from '../../../../../indexer/registry';
import { PalletCallDecoder } from '../../../../../indexer/types';
import { Call } from '../../../../../processor';
import { UnknownVersionError } from '../../../../../utils';
import { calls } from '../../../types';

// TODO: fix return type
export class SetIdentityCallPalletDecoder implements PalletCallDecoder<IIdentitySetIdentityCallPalletDecoder> {
  decode(call: Call): any {
    let identity = calls.identity.setIdentity;

    if (identity.v1030.is(call)) {
      return {
        twitter: {
          __kind: 'None',
        },
        ...identity.v1030.decode(call).info,
      };
    } else if (identity.v1032.is(call)) {
      return identity.v1032.decode(call).info;
    } else {
      throw new UnknownVersionError(identity);
    }
  }
}

// TODO: maybe remove?
// const clear_identity = {
//     decode(ctx: ChainContext, call: Call) {
//         let e = new IdentityClearIdentityCall(ctx, call)
//         if (e.isV1030) {
//             return e.asV1030
//         } else if (e.isV2028) {
//             const data = e.asV2028
//             if (data.sub.__kind !== 'Index') return {...data, sub: data.sub.value}
//             else throw new DataNotDecodableError(e, data)
//         } else if (e.isV9111) {
//             const data = e.asV9111
//             if (data.sub.__kind !== 'Index') return {...data, sub: data.sub.value}
//             else throw new DataNotDecodableError(e, data)
//         } else {
//             throw new UnknownVersionError(e)
//         }
//     },
// }
