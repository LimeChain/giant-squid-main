import { calls } from '@/chain/kusama/types';
import { UnknownVersionError } from '@/utils';
import { Call, ISetIdentityCallPalletDecoder } from '@/indexer';

export class SetIdentityCallPalletDecoder implements ISetIdentityCallPalletDecoder {
  decode(call: Call) {
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
