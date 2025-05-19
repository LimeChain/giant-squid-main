import { events } from '@/chain/polkadot/types';
import { UnknownVersionError } from '@/utils';
import { Event, INominationPoolsBondedEventPalletDecoder } from '@/indexer';

export class NominationPoolsBondedEventPalletDecoder implements INominationPoolsBondedEventPalletDecoder {
  decode(event: Event) {
    const { bonded } = events.nominationPools;

    if (bonded.v9280.is(event)) {
      const data = bonded.v9280.decode(event);
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
