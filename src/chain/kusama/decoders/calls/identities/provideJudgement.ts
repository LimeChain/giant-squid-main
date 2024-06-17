import { IIdentityProvideJudgementCallPalletDecoder } from '../../../../../indexer/registry';
import { PalletCallDecoder } from '../../../../../indexer/types';
import { Call } from '../../../../../processor';
import { DataNotDecodableError, UnknownVersionError } from '../../../../../utils';
import { calls } from '../../../types';

// TODO: fix return type
export class IdentityProvideJudgementCallPalletDecoder implements PalletCallDecoder<IIdentityProvideJudgementCallPalletDecoder> {
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
