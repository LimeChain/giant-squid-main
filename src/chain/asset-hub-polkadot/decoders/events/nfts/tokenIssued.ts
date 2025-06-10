import { events } from '@/chain/asset-hub-polkadot/types';
import { UnknownVersionError } from '@/utils';
import { Event, ITokenIssuedEventPalletDecoder } from '@/indexer';

export class TokenIssuedEventPalletDecoder implements ITokenIssuedEventPalletDecoder {
  decode(event: Event) {
    const issued = events.nfts.issued;

    if (issued.v9430.is(event)) {
      const data = issued.v9430.decode(event);

      return {
        collectionId: data.collection.toString(),
        item: data.item,
        owner: data.owner,
      };
    } else {
      throw new UnknownVersionError(issued);
    }
  }
}
