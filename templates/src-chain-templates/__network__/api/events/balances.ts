import { UnknownVersionError } from '../../../../utils';
import { BalancesTransferEvent } from '../../types/events';
import { ChainContext, Event } from '../../types/support';

const Transfer = {
  decode(ctx: ChainContext, event: Event) {
    let e = new BalancesTransferEvent(ctx, event);
    if (e.isV2000) {
      let [from, to, amount] = e.asV2000;
      return { from, to, amount };
    } else if (e.isV2011) {
      return e.asV2011;
    } else {
      throw new UnknownVersionError(e);
    }
  },
};

export default {
  Transfer,
};
