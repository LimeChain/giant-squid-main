import { events } from '@/chain/acala/types';
import { UnknownVersionError } from '@/utils';
import { Event, ITransferEventPalletDecoder } from '@/indexer';

export class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
  decode(event: Event) {
    const transfer = events.balances.transfer;
    if (transfer.v2000.is(event)) {
      let [from, to, amount] = transfer.v2000.decode(event);
      return { from, to, amount };
    } else if (transfer.v2011.is(event)) {
      return transfer.v2011.decode(event);
    } else {
      throw new UnknownVersionError(transfer);
    }
  }
}
