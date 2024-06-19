import { calls } from '../../../types';
import { Call, IAddSubCallPalletDecoder } from '../../../../../indexer';
import { DataNotDecodableError, UnknownVersionError } from '../../../../../utils';

export class AddSubCallPalletDecoder implements IAddSubCallPalletDecoder {
  decode(call: Call) {
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
