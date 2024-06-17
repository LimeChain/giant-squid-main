import { IIdentityAddSubCallPalletDecoder } from '../../../../../indexer/registry';
import { PalletCallDecoder } from '../../../../../indexer/types';
import { Call } from '../../../../../processor';
import { DataNotDecodableError, UnknownVersionError } from '../../../../../utils';
import { calls } from '../../../types';

// TODO: fix return type
export class IdentityAddSubCallPalletDecoder implements PalletCallDecoder<IIdentityAddSubCallPalletDecoder> {
  decode(call: Call): any {
    const { addSub } = calls.identity;
    if (addSub.v15.is(call)) {
      return addSub.v15.decode(call);
    } else if (addSub.v28.is(call)) {
      const data = addSub.v28.decode(call);
      if (data.sub.__kind !== 'Index') return { ...data, sub: data.sub.value };
      else throw new DataNotDecodableError(addSub, data);
    } else if (addSub.v9110.is(call)) {
      const data = addSub.v9110.decode(call);
      if (data.sub.__kind !== 'Index') return { ...data, sub: data.sub.value };
      else throw new DataNotDecodableError(addSub, data);
    } else {
      throw new UnknownVersionError(addSub);
    }
  }
}
