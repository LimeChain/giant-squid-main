import { events } from '@/chain/polkadot/types';
import { UnknownVersionError } from '@/utils';
import { Event, INominationPoolsUnbondedEventPalletDecoder } from '@/indexer';

export class NominationPoolsUnbondedEventPalletDecoder implements INominationPoolsUnbondedEventPalletDecoder {
  decode(event: Event) {
    const { unbonded } = events.nominationPools;

    if (unbonded.v9280.is(event)) {
      return unbonded.v9280.decode(event);
    }

    throw new UnknownVersionError(unbonded);
  }
}
