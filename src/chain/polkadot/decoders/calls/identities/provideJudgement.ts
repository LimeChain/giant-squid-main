import { IIdentityProvideJudgementCallPalletDecoder } from '../../../../../indexer/registry';
import { ICallPalletDecoder } from '../../../../../indexer/types';
import { Call } from '../../../../../indexer/processor';
import { DataNotDecodableError, UnknownVersionError } from '../../../../../utils';
import { calls } from '../../../types';

// TODO: fix return type
export class IdentityProvideJudgementCallPalletDecoder implements ICallPalletDecoder<IIdentityProvideJudgementCallPalletDecoder> {
  decode(call: Call): any {
    const { provideJudgement } = calls.identity;
    if (provideJudgement.v5.is(call)) {
      return provideJudgement.v5.decode(call);
    } else if (provideJudgement.v28.is(call)) {
      const data = provideJudgement.v28.decode(call);
      if (data.target.__kind === 'Id') return { ...data, target: data.target.value };
      else throw new DataNotDecodableError(provideJudgement, data);
    } else if (provideJudgement.v9110.is(call)) {
      const data = provideJudgement.v9110.decode(call);
      if (data.target.__kind === 'Id') return { ...data, target: data.target.value };
      else throw new DataNotDecodableError(provideJudgement, data);
    } else if (provideJudgement.v9300.is(call)) {
      const data = provideJudgement.v9300.decode(call);
      if (data.target.__kind === 'Id') return { ...data, target: data.target.value };
      else throw new DataNotDecodableError(provideJudgement, data);
    } else {
      throw new UnknownVersionError(provideJudgement);
    }
  }
}
