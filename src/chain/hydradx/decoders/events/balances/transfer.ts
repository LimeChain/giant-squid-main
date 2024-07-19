import { events } from '@/chain/hydradx/types';
import { UnknownVersionError } from '@/utils';
import { ITransferEventPalletDecoder, Event } from '@/indexer';

export class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
  decode(event: Event) {
    const { transfer } = events.balances;

    if (transfer.v100.is(event)) {
      let [from, to, amount] = transfer.v100.decode(event);
      return { from, to, amount };
    } else if (transfer.v104.is(event)) {
      return transfer.v104.decode(event);
    } else {
      throw new UnknownVersionError(transfer);
    }
  }
}
