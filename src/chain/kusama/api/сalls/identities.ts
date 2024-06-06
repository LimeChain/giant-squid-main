import { Call } from '../../../../processor';
import { DataNotDecodableError, UnknownVersionError } from '../../../../utils';
import { calls } from '../../types';

const set_identity = {
  decode(call: Call) {
    let identity = calls.identity.setIdentity;

    if (identity.v1030.is(call)) {
      return {
        twitter: {
          __kind: 'None',
        },
        ...identity.v1030.decode(call).info,
      };
    } else if (identity.v1032.is(call)) {
      return identity.v1032.decode(call).info;
    } else {
      throw new UnknownVersionError(identity);
    }
  },
};

const set_subs = {
  decode(call: Call) {
    let identity = calls.identity.setSubs;

    if (identity.v1030.is(call)) {
      return identity.v1030.decode(call);
    } else {
      throw new UnknownVersionError(identity);
    }
  },
};

const provide_judgement = {
  decode(call: Call) {
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
  },
};

const add_sub = {
  decode(call: Call) {
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
  },
};

const rename_sub = {
  decode(call: Call) {
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
  },
};

// const clear_identity = {
//     decode(ctx: ChainContext, call: Call) {
//         let e = new IdentityClearIdentityCall(ctx, call)
//         if (e.isV1030) {
//             return e.asV1030
//         } else if (e.isV2028) {
//             const data = e.asV2028
//             if (data.sub.__kind !== 'Index') return {...data, sub: data.sub.value}
//             else throw new DataNotDecodableError(e, data)
//         } else if (e.isV9111) {
//             const data = e.asV9111
//             if (data.sub.__kind !== 'Index') return {...data, sub: data.sub.value}
//             else throw new DataNotDecodableError(e, data)
//         } else {
//             throw new UnknownVersionError(e)
//         }
//     },
// }

export default {
  set_identity,
  set_subs,
  add_sub,
  rename_sub,
  provide_judgement,
};
