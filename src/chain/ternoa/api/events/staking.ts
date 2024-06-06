import { Event } from '@subsquid/substrate-processor';
import { UnknownVersionError } from '../../../../utils';
import { events } from '../../types';

const Rewarded = {
  decode(event: Event) {
    const { rewarded } = events.staking;
    if (rewarded.v1.is(event)) {
      let [stash, amount] = rewarded.v1.decode(event);
      return { stash, amount };
    } else if (rewarded.v11.is(event)) {
      return rewarded.v11.decode(event);
    } else {
      throw new UnknownVersionError(rewarded);
    }
  },
};

export default {
  Rewarded,
};
