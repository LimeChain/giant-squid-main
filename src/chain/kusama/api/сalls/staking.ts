import { Call } from '@subsquid/substrate-processor';
import { UnknownVersionError } from '../../../../utils';
import { calls } from '../../types';

const payout_stakers = {
  decode(event: Call) {
    let call = calls.staking.payoutStakers;

    if (call.v1058.is(event)) {
      return call.v1058.decode(event);
    } else {
      throw new UnknownVersionError(event);
    }
  },
};

export default {
  payout_stakers,
};
