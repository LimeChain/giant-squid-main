import { events } from '@/chain/asset-hub-polkadot/types';
import { UnknownVersionError } from '@/utils';
import { Event, ICreatedEventPalletDecoder } from '@/indexer';

export class CreatedEventPalletDecoder implements ICreatedEventPalletDecoder {
  decode(event: Event) {
    const created = events.nfts.created;

    if (created.v9430.is(event)) {
      return created.v9430.decode(event);
    } else {
      throw new UnknownVersionError(created);
    }
  }
}
