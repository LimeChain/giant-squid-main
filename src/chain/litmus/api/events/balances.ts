import { Event } from '@subsquid/substrate-processor';
import { UnknownVersionError } from '../../../../utils';
import { events } from '../../types';

const Transfer = {
  decode(event: Event) {
    const { transfer } = events.balances;
    if (transfer.v9020.is(event)) {
      return transfer.v9020.decode(event);
    } else {
      throw new UnknownVersionError(transfer);
    }
  },
};

export default {
  Transfer,
};
