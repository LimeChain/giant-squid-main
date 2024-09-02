import { calls } from '@/chain/polkadot/types';
import { UnknownVersionError } from '@/utils';
import { Call, ISetIdentityCallPalletDecoder } from '@/indexer';

export class SetIdentityCallPalletDecoder implements ISetIdentityCallPalletDecoder {
  decode(call: Call) {
    const { setIdentity } = calls.identity;
    if (setIdentity.v5.is(call)) {
      return setIdentity.v5.decode(call).info;
    } else {
      throw new UnknownVersionError(setIdentity);
    }
  }
}
