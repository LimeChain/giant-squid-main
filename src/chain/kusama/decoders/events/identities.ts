import { Event } from '../../../../processor';
import { UnknownVersionError } from '../../../../utils';
import { events } from '../../types';

const IdentityCleared = {
  decode(event: Event) {
    let identity = events.identity.identityCleared;
    if (identity.v1030.is(event)) {
      const [who, deposit] = identity.v1030.decode(event);
      return { who, deposit };
    } else if (identity.v9130.is(event)) {
      return identity.v9130.decode(event);
    } else {
      throw new UnknownVersionError(identity);
    }
  },
};

const IdentityKilled = {
  decode(event: Event) {
    let identity = events.identity.identityKilled;
    if (identity.v1030.is(event)) {
      const [who, deposit] = identity.v1030.decode(event);
      return { who, deposit };
    } else if (identity.v9130.is(event)) {
      return identity.v9130.decode(event);
    } else {
      throw new UnknownVersionError(identity);
    }
  },
};

const IdentitySubRemoved = {
  decode(event: Event) {
    const identity = events.identity.subIdentityRemoved;

    if (identity.v2015.is(event)) {
      const [sub, main, deposit] = identity.v2015.decode(event);
      return { sub, main, deposit };
    } else if (identity.v9130.is(event)) {
      return identity.v9130.decode(event);
    } else {
      throw new UnknownVersionError(identity);
    }
  },
};

const IdentitySubRevoked = {
  decode(event: Event) {
    const identity = events.identity.subIdentityRevoked;
    if (identity.v2015.is(event)) {
      const [sub, main, deposit] = identity.v2015.decode(event);
      return { sub, main, deposit };
    } else if (identity.v9130.is(event)) {
      return identity.v9130.decode(event);
    } else {
      throw new UnknownVersionError(identity);
    }
  },
};

export default {
  IdentityCleared,
  IdentityKilled,
  IdentitySubRemoved,
  IdentitySubRevoked,
};
