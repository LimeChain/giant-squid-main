import { Call } from '../../../../processor';
import { DataNotDecodableError, UnknownVersionError } from '../../../../utils';
import { calls } from '../../types';
import {
  IIdentityAddSubCallPalletDecoder,
  IIdentityProvideJudgementCallPalletDecoder,
  IIdentityRenameSubCallPalletDecoder,
  IIdentitySetIdentityCallPalletDecoder,
  IIdentitySetSubsCallPalletDecoder,
} from '../../../../indexer/registry';
import { PalletCallDecoder } from '../../../../indexer/types';

// TODO: fix return type
export class SetIdentityCallPalletDecoder implements PalletCallDecoder<IIdentitySetIdentityCallPalletDecoder> {
  decode(call: Call): any {
    const { setIdentity } = calls.identity;
    if (setIdentity.v5.is(call)) {
      return setIdentity.v5.decode(call).info;
    } else {
      throw new UnknownVersionError(setIdentity);
    }
  }
}

// TODO: fix return type
export class IdentitySetSubsCallPalletDecoder implements PalletCallDecoder<IIdentitySetSubsCallPalletDecoder> {
  decode(call: Call): any {
    const { setSubs } = calls.identity;
    if (setSubs.v5.is(call)) {
      return setSubs.v5.decode(call);
    } else {
      throw new UnknownVersionError(setSubs);
    }
  }
}

// TODO: fix return type
export class IdentityProvideJudgementCallPalletDecoder implements PalletCallDecoder<IIdentityProvideJudgementCallPalletDecoder> {
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

// TODO: fix return type
export class RenameIdentityCallPalletDecoder implements PalletCallDecoder<IIdentityRenameSubCallPalletDecoder> {
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

// const clear_identity = {
//     decode(call: Call) {
//         let e = new IdentityClearIdentityCall(ctx, call)
//         if (e.isV1030) {
//             return e.asV1030
//         } else if (e.isV28) {
//             const data = e.asV28
//             if (data.sub.__kind !== 'Index') return {...data, sub: data.sub.value}
//             else throw new DataNotDecodableError(e, data)
//         } else if (e.isV9110) {
//             const data = e.asV9110
//             if (data.sub.__kind !== 'Index') return {...data, sub: data.sub.value}
//             else throw new DataNotDecodableError(e, data)
//         } else {
//             throw new UnknownVersionError(e)
//         }
//     },
// }
