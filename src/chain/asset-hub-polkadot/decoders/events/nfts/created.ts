import { events } from '@/chain/asset-hub-polkadot/types';
import { UnknownVersionError } from '@/utils';
import { Event, ICollectionCreatedEventPalletDecoder } from '@/indexer';

export class CreatedEventPalletDecoder implements ICollectionCreatedEventPalletDecoder {
  decode(event: Event) {
    const created = events.nfts.created;

    if (created.v9430.is(event)) {
      const createdCollection = created.v9430.decode(event);

      return {
        collection: createdCollection.collection.toString(),
        creator: createdCollection.creator,
        owner: createdCollection.owner,
      };
    } else {
      throw new UnknownVersionError(created);
    }
  }
}
