import { Call } from '@subsquid/substrate-processor';
import { UnknownVersionError } from '../../../../utils';
import { calls } from '../../types';

const payout_stakers = {
  decode(event: Call) {
    const { payoutStakers } = calls.staking;
    if (payoutStakers.v1.is(event)) {
      return payoutStakers.v1.decode(event);
    } else {
      throw new UnknownVersionError(payoutStakers);
    }
  },
};

export default {
  payout_stakers,
};
