import { events } from '@/chain/kusama/types';
import { UnknownVersionError } from '@/utils';
import { Event, INominationPoolsDestroyedEventPalletDecoder } from '@/indexer';

export class NominationPoolsDestroyedEventPalletDecoder implements INominationPoolsDestroyedEventPalletDecoder {
  decode(event: Event) {
    const { destroyed } = events.nominationPools;

    if (destroyed.v9220.is(event)) {
      const data = destroyed.v9220.decode(event);

      return {
        poolId: data.poolId.toString(),
      };
    }

    throw new UnknownVersionError(destroyed);
  }
}
