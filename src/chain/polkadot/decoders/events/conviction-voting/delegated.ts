import { events } from '@/chain/polkadot/types';
import { Event, IDelegatedEventPalletDecoder } from '@/indexer';

import { UnknownVersionError } from '@/utils';

export class DelegatedEventPalletDecoder implements IDelegatedEventPalletDecoder {
  decode(call: Event) {
    const { delegated } = events.convictionVoting;

    if (delegated.v9420.is(call)) {
      const fund = delegated.v9420.decode(call);

      return { from: fund[0], to: fund[1] };
    }

    throw new UnknownVersionError(delegated);
  }
}
