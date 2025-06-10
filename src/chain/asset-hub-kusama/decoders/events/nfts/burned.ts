import { events } from '@/chain/asset-hub-kusama/types';
import { UnknownVersionError } from '@/utils';
import { Event, ITokenBurnedEventPalletDecoder, ITokenIssuedEventPalletDecoder } from '@/indexer';

export class TokenBurnedEventPalletDecoder implements ITokenBurnedEventPalletDecoder {
  decode(event: Event) {
    const burned = events.nfts.burned;

    if (burned.v9420.is(event)) {
      const data = burned.v9420.decode(event);

      return {
        collectionId: data.collection.toString(),
        item: data.item.toString(),
        owner: data.owner,
      };
    } else {
      throw new UnknownVersionError(burned);
    }
  }
}
