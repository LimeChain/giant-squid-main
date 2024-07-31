import { events } from '@/chain/kusama/types';
import { Event, IAllRefundedEventPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class AllRefundedEventPalletDecoder implements IAllRefundedEventPalletDecoder {
  decode(call: Event) {
    const { allRefunded } = events.crowdloan;

    if (allRefunded.v9010.is(call)) {
      return { paraId: allRefunded.v9010.decode(call) };
    }
    if (allRefunded.v9230.is(call)) {
      return { paraId: allRefunded.v9230.decode(call).paraId };
    }

    throw new UnknownVersionError(allRefunded);
  }
}
