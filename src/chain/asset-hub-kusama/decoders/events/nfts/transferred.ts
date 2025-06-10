import { events } from '@/chain/asset-hub-kusama/types';
import { UnknownVersionError } from '@/utils';
import { Event, ITokenTransferredEventPalletDecoder } from '@/indexer';

export class TokenTransferredEventPalletDecoder implements ITokenTransferredEventPalletDecoder {
  decode(event: Event) {
    const transfer = events.nfts.transferred;

    if (transfer.v9420.is(event)) {
      const data = transfer.v9420.decode(event);

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
