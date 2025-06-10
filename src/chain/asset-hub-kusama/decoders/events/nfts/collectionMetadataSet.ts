import { events } from '@/chain/asset-hub-kusama/types';
import { decodeHexToUTF8, UnknownVersionError } from '@/utils';
import { Event, ICollectionMetadataSetEventPalletDecoder } from '@/indexer';

export class CollectionMetadataSetEventPalletDecoder implements ICollectionMetadataSetEventPalletDecoder {
  decode(event: Event) {
    const metadata = events.nfts.collectionMetadataSet;

    if (metadata.v9420.is(event)) {
      const collectionMetadata = metadata.v9420.decode(event);

      return {
        collectionId: collectionMetadata.collection.toString(),
        metadataUri: decodeHexToUTF8(collectionMetadata.data),
      };
    } else {
      throw new UnknownVersionError(metadata);
    }
  }
}
