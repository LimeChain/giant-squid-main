import { events } from '@/chain/asset-hub-polkadot/types';
import { decodeHexToUTF8, UnknownVersionError } from '@/utils';
import { Event, ICollectionCreatedEventPalletDecoder, ITokenMetadataSetEventPalletDecoder } from '@/indexer';

export class TokenMetadataSetEventPalletDecoder implements ITokenMetadataSetEventPalletDecoder {
  decode(event: Event) {
    const tokenMetadata = events.nfts.itemMetadataSet;

    if (tokenMetadata.v9430.is(event)) {
      const data = tokenMetadata.v9430.decode(event);

      return {
        collectionId: data.collection.toString(),
        item: data.item,
        data: decodeHexToUTF8(data.data),
      };
    } else {
      throw new UnknownVersionError(tokenMetadata);
    }
  }
}
