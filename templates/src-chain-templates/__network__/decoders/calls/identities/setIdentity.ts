// import { IIdentitySetIdentityCallPalletDecoder } from '../../../../../indexer/registry';
// import { PalletCallDecoder } from '../../../../../indexer/types';
// import { Call } from '../../../../../processor';
// import { UnknownVersionError } from '../../../../../utils';
// import { calls } from '../../../types';
// export class SetIdentityCallPalletDecoder implements PalletCallDecoder<IIdentitySetIdentityCallPalletDecoder> {
//   decode(call: Call): any {
//     let identity = calls.identity.setIdentity;

//     if (identity.v1030.is(call)) {
//       return {
//         twitter: {
//           __kind: 'None',
//         },
//         ...identity.v1030.decode(call).info,
//       };
//     } else if (identity.v1032.is(call)) {
//       return identity.v1032.decode(call).info;
//     } else {
//       throw new UnknownVersionError(identity);
//     }
//   }
// }
