import { events } from '../../../types';
import { Event } from '../../../../../indexer';
import { UnknownVersionError } from '../../../../../utils';
import { ITransferEventPalletDecoder } from '../../../../../indexer';

export class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
  decode(event: Event) {
    const { transfer } = events.balances;
    if (transfer.v9000.is(event)) {
      let [from, to, amount] = transfer.v9000.decode(event);
      return { from, to, amount };
    } else if (transfer.v9071.is(event)) {
      return transfer.v9071.decode(event);
    } else {
      throw new UnknownVersionError(transfer);
    }
  }
}
