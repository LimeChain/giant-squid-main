import { UnknownVersionError } from '../../../../../utils';
import { events } from '../../../types';
import { Event, ITransferEventPalletDecoder } from '../../../../../indexer';

export class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
  decode(event: Event) {
    const { transfer } = events.balances;
    if (transfer.v1.is(event)) {
      let [from, to, amount] = transfer.v1.decode(event);
      return { from, to, amount };
    } else if (transfer.v3.is(event)) {
      return transfer.v3.decode(event);
    } else {
      throw new UnknownVersionError(transfer);
    }
  }
}
