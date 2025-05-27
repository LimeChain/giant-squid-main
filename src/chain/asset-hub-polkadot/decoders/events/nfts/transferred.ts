import { events } from '@/chain/asset-hub-polkadot/types';
import { UnknownVersionError } from '@/utils';
import { Event, ITokenBurnedEventPalletDecoder, ITokenIssuedEventPalletDecoder, ITokenTransferredEventPalletDecoder } from '@/indexer';

export class TokenTransferredEventPalletDecoder implements ITokenTransferredEventPalletDecoder {
  decode(event: Event) {
    const transfer = events.nfts.transferred;

    if (transfer.v9430.is(event)) {
      const data = transfer.v9430.decode(event);

      return {
        collectionId: data.collection.toString(),
        item: data.item,
        from: data.from,
        to: data.to,
      };
    } else {
      throw new UnknownVersionError(transfer);
    }
  }
}
