import { events } from '@/chain/asset-hub-polkadot/types';
import { UnknownVersionError } from '@/utils';
import { Event, ITokenBurnedEventPalletDecoder, ITokenIssuedEventPalletDecoder } from '@/indexer';

export class TokenBurnedEventPalletDecoder implements ITokenBurnedEventPalletDecoder {
  decode(event: Event) {
    const burned = events.nfts.burned;

    if (burned.v9430.is(event)) {
      const data = burned.v9430.decode(event);

      return {
        collectionId: data.collection.toString(),
        item: data.item,
        owner: data.owner,
      };
    } else {
      throw new UnknownVersionError(burned);
    }
  }
}
