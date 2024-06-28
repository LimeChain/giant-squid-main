import { Event, ITransferEventPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';
import { events } from '@/chain/basilisk/types';

export class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
  decode(event: Event) {
    const { transfer } = events.balances;
    if (transfer.v16.is(event)) {
      let [from, to, amount] = transfer.v16.decode(event);
      return { from, to, amount };
    } else if (transfer.v38.is(event)) {
      return transfer.v38.decode(event);
    } else {
      throw new UnknownVersionError(transfer);
    }
  }
}
