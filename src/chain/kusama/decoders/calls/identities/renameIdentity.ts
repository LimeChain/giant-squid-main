import { calls } from '@/chain/kusama/types';
import { Call, IRenameSubCallPalletDecoder } from '@/indexer';
import { DataNotDecodableError, UnknownVersionError } from '@/utils';

export class RenameIdentityCallPalletDecoder implements IRenameSubCallPalletDecoder {
  decode(call: Call) {
    const identityCall = calls.identity.renameSub;

    if (identityCall.v2015.is(call)) {
      return identityCall.v2015.decode(call);
    } else if (identityCall.v2028.is(call)) {
      const data = identityCall.v2028.decode(call);
      if (data.sub.__kind !== 'Index') return { ...data, sub: data.sub.value };
      else throw new DataNotDecodableError(identityCall, data);
    } else if (identityCall.v9111.is(call)) {
      const data = identityCall.v9111.decode(call);
      if (data.sub.__kind !== 'Index') return { ...data, sub: data.sub.value };
      else throw new DataNotDecodableError(identityCall, data);
    } else {
      throw new UnknownVersionError(identityCall);
    }
  }
}
