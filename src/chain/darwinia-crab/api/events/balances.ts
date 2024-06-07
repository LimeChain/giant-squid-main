import { Event } from '@subsquid/substrate-processor';
import { UnknownVersionError } from '../../../../utils';
import { events } from '../../types';

const Transfer = {
  decode(event: Event) {
    const { transfer } = events.balances;
    if (transfer.v6000.is(event)) {
      return transfer.v6000.decode(event);
    } else {
      throw new UnknownVersionError(transfer);
    }
  },
};

export default {
  Transfer,
};
