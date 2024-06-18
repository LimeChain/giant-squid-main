import { events } from '../../../types';
import { Event } from '../../../../../indexer';
import { UnknownVersionError } from '../../../../../utils';
import { ITransferEventPalletDecoder } from '../../../../../indexer';

export class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
  decode(event: Event) {
    const { transfer } = events.balances;
    if (transfer.v5.is(event)) {
      let [from, to, amount] = transfer.v5.decode(event);
      return { from, to, amount };
    } else if (transfer.v8.is(event)) {
      return transfer.v8.decode(event);
    } else {
      throw new UnknownVersionError(transfer);
    }
  }
}
