import { events } from '@/chain/polkadot/types';
import { UnknownVersionError } from '@/utils';
import { Event, IBondedEventPalletDecoder, INominationPoolsBondedEventPalletDecoder } from '@/indexer';

export class NominationPoolsBondedEventPalletDecoder implements INominationPoolsBondedEventPalletDecoder {
  decode(event: Event) {
    const { bonded } = events.nominationPools;

    if (bonded.v9280.is(event)) {
      return bonded.v9280.decode(event);
    }

    throw new UnknownVersionError(bonded);
  }
}
