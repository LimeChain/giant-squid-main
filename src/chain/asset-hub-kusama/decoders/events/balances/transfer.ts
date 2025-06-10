import { events } from '@/chain/asset-hub-kusama/types';
import { UnknownVersionError } from '@/utils';
import { Event, ITransferEventPalletDecoder } from '@/indexer';

export class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
  decode(event: Event) {
    const transfer = events.balances.transfer;
    if (transfer.v1.is(event)) {
      let [from, to, amount] = transfer.v1.decode(event);
      return { from, to, amount };
    } else if (transfer.v700.is(event)) {
      let { from, to, amount } = transfer.v700.decode(event);
      return { from, to, amount };
    } else {
      throw new UnknownVersionError(transfer);
    }
  }
}
