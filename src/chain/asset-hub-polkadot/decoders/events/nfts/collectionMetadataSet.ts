import { events } from '@/chain/asset-hub-polkadot/types';
import { decodeHexToUTF8, UnknownVersionError } from '@/utils';
import { Event, ICollectionMetadataSetEventPalletDecoder } from '@/indexer';

export class CollectionMetadataSetEventPalletDecoder implements ICollectionMetadataSetEventPalletDecoder {
  decode(event: Event) {
    const metadata = events.nfts.collectionMetadataSet;

    if (metadata.v9430.is(event)) {
      const collectionMetadata = metadata.v9430.decode(event);

      return {
        collectionId: collectionMetadata.collection.toString(),
        metadataUri: decodeHexToUTF8(collectionMetadata.data),
      };
    } else {
      throw new UnknownVersionError(metadata);
    }
  }
}
