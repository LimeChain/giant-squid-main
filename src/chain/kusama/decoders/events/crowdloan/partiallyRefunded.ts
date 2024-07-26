import { events } from '@/chain/kusama/types';
import { Event, IPartiallyRefundedEventPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class PartiallyRefundedEventPalletDecoder implements IPartiallyRefundedEventPalletDecoder {
  decode(call: Event) {
    const { partiallyRefunded } = events.crowdloan;

    if (partiallyRefunded.v9010.is(call)) {
      return { paraId: partiallyRefunded.v9010.decode(call) };
    }
    if (partiallyRefunded.v9230.is(call)) {
      return { paraId: partiallyRefunded.v9230.decode(call).paraId };
    }

    throw new UnknownVersionError(partiallyRefunded);
  }
}
