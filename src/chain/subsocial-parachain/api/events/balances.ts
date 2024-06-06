import { Event } from '@subsquid/substrate-processor';
import { UnknownVersionError } from '../../../../utils';
import { events } from '../../types';

export const Transfer = {
  decode(event: Event) {
    const { transfer } = events.balances;
    if (transfer.v1.is(event)) {
      let [from, to, amount] = transfer.v1.decode(event);
      return { from, to, amount };
    } else if (transfer.v2.is(event)) {
      return transfer.v2.decode(event);
    } else {
      throw new UnknownVersionError(transfer);
    }
  },
};

export default {
  Transfer,
};
