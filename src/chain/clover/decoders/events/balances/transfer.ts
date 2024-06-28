import { events } from '@/chain/clover/types';
import { UnknownVersionError } from '@/utils';
import { ITransferEventPalletDecoder, Event } from '@/indexer';

export class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
  decode(event: Event) {
    const { transfer } = events.balances;
    if (transfer.v10.is(event)) {
      let [from, to, amount] = transfer.v10.decode(event);
      return { from, to, amount };
    } else {
      throw new UnknownVersionError(transfer);
    }
  }
}
