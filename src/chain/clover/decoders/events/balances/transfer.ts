import { events } from '../../../types';
import { Event } from '../../../../../indexer';
import { UnknownVersionError } from '../../../../../utils';
import { ITransferEventPalletDecoder } from '../../../../../indexer';

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
