import { calls } from '../../../types';
import { Call } from '../../../../../indexer';
import { IProvideJudgementCallPalletDecoder } from '../../../../../indexer';
import { DataNotDecodableError, UnknownVersionError } from '../../../../../utils';

// TODO: fix return type
export class ProvideJudgementCallPalletDecoder implements IProvideJudgementCallPalletDecoder {
  decode(call: Call): any {
    const identity = calls.identity.provideJudgement;
    if (identity.v1030.is(call)) {
      const data = identity.v1030.decode(call);
      if (data.target.__kind === 'AccountId') return { ...data, target: data.target.value };
      else throw new DataNotDecodableError(identity, data);
    } else if (identity.v1050.is(call)) {
      return identity.v1050.decode(call);
    } else if (identity.v2028.is(call)) {
      const data = identity.v2028.decode(call);
      if (data.target.__kind === 'Id') return { ...data, target: data.target.value };
      else throw new DataNotDecodableError(identity, data);
    } else if (identity.v9111.is(call)) {
      const data = identity.v9111.decode(call);
      if (data.target.__kind === 'Id') return { ...data, target: data.target.value };
      else throw new DataNotDecodableError(identity, data);
    } else if (identity.v9300.is(call)) {
      const data = identity.v9300.decode(call);
      if (data.target.__kind === 'Id') return { ...data, target: data.target.value };
      else throw new DataNotDecodableError(identity, data);
    } else {
      throw new UnknownVersionError(identity);
    }
  }
}
