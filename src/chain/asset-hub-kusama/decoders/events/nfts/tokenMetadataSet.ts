import { events } from '@/chain/asset-hub-kusama/types';
import { decodeHexToUTF8, UnknownVersionError } from '@/utils';
import { Event, ITokenMetadataSetEventPalletDecoder } from '@/indexer';

export class TokenMetadataSetEventPalletDecoder implements ITokenMetadataSetEventPalletDecoder {
  decode(event: Event) {
    const tokenMetadata = events.nfts.itemMetadataSet;

    if (tokenMetadata.v9420.is(event)) {
      const data = tokenMetadata.v9420.decode(event);

      return {
        collectionId: data.collection.toString(),
        item: data.item.toString(),
        data: decodeHexToUTF8(data.data),
      };
    } else {
      throw new UnknownVersionError(tokenMetadata);
    }
  }
}
