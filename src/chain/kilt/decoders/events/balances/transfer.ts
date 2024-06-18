import { events } from '../../../types';
import { Event } from '../../../../../indexer';
import { UnknownVersionError } from '../../../../../utils';
import { ITransferEventPalletDecoder } from '../../../../../indexer';

export class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
  decode(event: Event) {
    const { transfer } = events.balances;
    if (transfer.v21.is(event)) {
      let [from, to, amount] = transfer.v21.decode(event);
      return { from, to, amount };
    } else if (transfer.v10400.is(event)) {
      return transfer.v10400.decode(event);
    } else {
      throw new UnknownVersionError(transfer);
    }
  }
}
