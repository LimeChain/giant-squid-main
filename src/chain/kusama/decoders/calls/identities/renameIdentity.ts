import { IIdentityRenameSubCallPalletDecoder } from '../../../../../indexer/registry';
import { ICallPalletDecoder } from '../../../../../indexer/types';
import { Call } from '../../../../../indexer/processor';
import { DataNotDecodableError, UnknownVersionError } from '../../../../../utils';
import { calls } from '../../../types';

// TODO: fix return type
export class RenameIdentityCallPalletDecoder implements ICallPalletDecoder<IIdentityRenameSubCallPalletDecoder> {
  decode(call: Call): any {
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
