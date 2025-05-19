import { events } from '@/chain/polkadot/types';
import { UnknownVersionError } from '@/utils';
import { Event, INominationPoolsDestroyedEventPalletDecoder } from '@/indexer';

export class NominationPoolsDestroyedEventPalletDecoder implements INominationPoolsDestroyedEventPalletDecoder {
  decode(event: Event) {
    const { destroyed } = events.nominationPools;

    if (destroyed.v9280.is(event)) {
      const data = destroyed.v9280.decode(event);

      return {
        poolId: data.poolId.toString(),
      };
    }

    throw new UnknownVersionError(destroyed);
  }
}
