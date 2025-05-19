import { events } from '@/chain/kusama/types';
import { UnknownVersionError } from '@/utils';
import { Event, INominationPoolsBondedEventPalletDecoder } from '@/indexer';

export class NominationPoolsBondedEventPalletDecoder implements INominationPoolsBondedEventPalletDecoder {
  decode(event: Event) {
    const { bonded } = events.nominationPools;

    if (bonded.v9220.is(event)) {
      const data = bonded.v9220.decode(event);
      return {
        member: data.member,
        poolId: data.poolId.toString(),
        bonded: data.bonded,
        joined: data.joined,
      };
    }

    throw new UnknownVersionError(bonded);
  }
}
