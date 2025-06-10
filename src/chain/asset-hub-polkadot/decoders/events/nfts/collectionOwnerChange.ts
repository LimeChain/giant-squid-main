import { events } from '@/chain/asset-hub-polkadot/types';
import { UnknownVersionError } from '@/utils';
import { Event, ICollectionOwnerChangeEventPalletDecoder } from '@/indexer';

export class CollectionOwnerChangeEventPalletDecoder implements ICollectionOwnerChangeEventPalletDecoder {
  decode(event: Event) {
    const data = events.nfts.ownerChanged;

    if (data.v9430.is(event)) {
      const collectionMetadata = data.v9430.decode(event);

      return {
        collectionId: collectionMetadata.collection.toString(),
        newOwner: collectionMetadata.newOwner,
      };
    } else {
      throw new UnknownVersionError(data);
    }
  }
}
