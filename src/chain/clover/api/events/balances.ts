import { Event } from '@subsquid/substrate-processor';
import { UnknownVersionError } from '../../../../utils';
import { events } from '../../types';

const Transfer = {
  decode(event: Event) {
    const { transfer } = events.balances;
    if (transfer.v10.is(event)) {
      let [from, to, amount] = transfer.v10.decode(event);
      return { from, to, amount };
    } else {
      throw new UnknownVersionError(transfer);
    }
  },
};

export default {
  Transfer,
};
