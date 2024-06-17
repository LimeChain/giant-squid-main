import { Event } from '@subsquid/substrate-processor';
import { UnknownVersionError } from '../../../../utils';
import { events } from '../../types';

//TODO: these are unimplemented
const IdentityCleared = {
  decode(event: Event) {
    const { identityCleared } = events.identity;
    if (identityCleared.v5.is(event)) {
      const [who, deposit] = identityCleared.v5.decode(event);
      return { who, deposit };
    } else if (identityCleared.v9140.is(event)) {
      return identityCleared.v9140.decode(event);
    } else {
      throw new UnknownVersionError(identityCleared);
    }
  },
};

const IdentityKilled = {
  decode(event: Event) {
    const { identityKilled } = events.identity;
    if (identityKilled.v5.is(event)) {
      const [who, deposit] = identityKilled.v5.decode(event);
      return { who, deposit };
    } else if (identityKilled.v9140.is(event)) {
      return identityKilled.v9140.decode(event);
    } else {
      throw new UnknownVersionError(identityKilled);
    }
  },
};

const IdentitySubRemoved = {
  decode(event: Event) {
    const { subIdentityRemoved } = events.identity;
    if (subIdentityRemoved.v15.is(event)) {
      const [sub, main, deposit] = subIdentityRemoved.v15.decode(event);
      return { sub, main, deposit };
    } else if (subIdentityRemoved.v9140.is(event)) {
      return subIdentityRemoved.v9140.decode(event);
    } else {
      throw new UnknownVersionError(subIdentityRemoved);
    }
  },
};

const IdentitySubRevoked = {
  decode(event: Event) {
    const { subIdentityRevoked } = events.identity;
    if (subIdentityRevoked.v15.is(event)) {
      const [sub, main, deposit] = subIdentityRevoked.v15.decode(event);
      return { sub, main, deposit };
    } else if (subIdentityRevoked.v9140.is(event)) {
      return subIdentityRevoked.v9140.decode(event);
    } else {
      throw new UnknownVersionError(subIdentityRevoked);
    }
  },
};

export default {
  IdentityCleared,
  IdentityKilled,
  IdentitySubRemoved,
  IdentitySubRevoked,
};
