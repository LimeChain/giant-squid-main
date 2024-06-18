import { events } from '../../../types';
import { Event } from '../../../../../indexer';
import { UnknownVersionError } from '../../../../../utils';
import { ITransferEventPalletDecoder } from '../../../../../indexer';

export class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
  decode(event: Event) {
    const { transfer } = events.balances;
    if (transfer.v900.is(event)) {
      let [from, to, amount] = transfer.v900.decode(event);
      return { from, to, amount };
    } else if (transfer.v1201.is(event)) {
      return transfer.v1201.decode(event);
    } else {
      throw new UnknownVersionError(transfer);
    }
  }
}
