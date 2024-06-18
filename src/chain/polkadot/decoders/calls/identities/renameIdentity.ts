import { IIdentityRenameSubCallPalletDecoder } from '../../../../../indexer/registry';
import { ICallPalletDecoder } from '../../../../../indexer/types';
import { Call } from '../../../../../indexer/processor';
import { DataNotDecodableError, UnknownVersionError } from '../../../../../utils';
import { calls } from '../../../types';

// TODO: fix return type
export class RenameIdentityCallPalletDecoder implements ICallPalletDecoder<IIdentityRenameSubCallPalletDecoder> {
  decode(call: Call): any {
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
