import { events } from '@/chain/kusama/types';
import { Event, IDelegatedEventPalletDecoder } from '@/indexer';

import { UnknownVersionError } from '@/utils';

export class DelegatedEventPalletDecoder implements IDelegatedEventPalletDecoder {
  decode(call: Event) {
    const { delegated } = events.convictionVoting;

    if (delegated.v9320.is(call)) {
      const fund = delegated.v9320.decode(call);

      return { from: fund[0], to: fund[1] };
    }

    throw new UnknownVersionError(delegated);
  }
}
