import { Call } from '@subsquid/substrate-processor';
import { UnknownVersionError } from '../../../../utils';
import { calls } from '../../types';

const payout_stakers = {
  decode(event: Call) {
    const { payoutStakers } = calls.staking;
    if (payoutStakers.v0.is(event)) {
      return payoutStakers.v0.decode(event);
    } else {
      throw new UnknownVersionError(payoutStakers);
    }
  },
};

export default {
  payout_stakers,
};
