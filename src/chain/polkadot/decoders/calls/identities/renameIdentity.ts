import { calls } from '../../../types';
import { Call, IRenameSubCallPalletDecoder } from '../../../../../indexer';
import { DataNotDecodableError, UnknownVersionError } from '../../../../../utils';

export class RenameIdentityCallPalletDecoder implements IRenameSubCallPalletDecoder {
  decode(call: Call) {
    const { renameSub } = calls.identity;
    if (renameSub.v15.is(call)) {
      return renameSub.v15.decode(call);
    } else if (renameSub.v28.is(call)) {
      const data = renameSub.v28.decode(call);
      if (data.sub.__kind !== 'Index') return { ...data, sub: data.sub.value };
      else throw new DataNotDecodableError(renameSub, data);
    } else if (renameSub.v9110.is(call)) {
      const data = renameSub.v9110.decode(call);
      if (data.sub.__kind !== 'Index') return { ...data, sub: data.sub.value };
      else throw new DataNotDecodableError(renameSub, data);
    } else {
      throw new UnknownVersionError(renameSub);
    }
  }
}
