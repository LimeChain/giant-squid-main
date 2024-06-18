import { IIdentityAddSubCallPalletDecoder } from '../../../../../indexer/registry';
import { ICallPalletDecoder } from '../../../../../indexer/types';
import { Call } from '../../../../../indexer/processor';
import { DataNotDecodableError, UnknownVersionError } from '../../../../../utils';
import { calls } from '../../../types';

// TODO: fix return type
export class IdentityAddSubCallPalletDecoder implements ICallPalletDecoder<IIdentityAddSubCallPalletDecoder> {
  decode(call: Call): any {
    const identity = calls.identity.addSub;

    if (identity.v2015.is(call)) {
      return identity.v2015.decode(call);
    } else if (identity.v2028.is(call)) {
      const data = identity.v2028.decode(call);
      if (data.sub.__kind !== 'Index') return { ...data, sub: data.sub.value };
      else throw new DataNotDecodableError(identity, data);
    } else if (identity.v9111.is(call)) {
      const data = identity.v9111.decode(call);
      if (data.sub.__kind !== 'Index') return { ...data, sub: data.sub.value };
      else throw new DataNotDecodableError(identity, data);
    } else {
      throw new UnknownVersionError(identity);
    }
  }
}
