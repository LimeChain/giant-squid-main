import { events } from '@/chain/asset-hub-kusama/types';
import { UnknownVersionError } from '@/utils';
import { Event, ICollectionOwnerChangeEventPalletDecoder } from '@/indexer';

export class CollectionOwnerChangeEventPalletDecoder implements ICollectionOwnerChangeEventPalletDecoder {
  decode(event: Event) {
    const data = events.nfts.ownerChanged;

    if (data.v9420.is(event)) {
      const collectionMetadata = data.v9420.decode(event);

      return {
        collectionId: collectionMetadata.collection.toString(),
        newOwner: collectionMetadata.newOwner,
      };
    } else {
      throw new UnknownVersionError(data);
    }
  }
}
