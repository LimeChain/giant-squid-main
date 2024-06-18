import { events } from '../../../types';
import { Event } from '../../../../../indexer';
import { UnknownVersionError } from '../../../../../utils';
import { ITransferEventPalletDecoder } from '../../../../../indexer';

export class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
  decode(event: Event) {
    const { transfer } = events.balances;
    if (transfer.v1000.is(event)) {
      let [from, to, amount] = transfer.v1000.decode(event);
      return { from, to, amount };
    } else if (transfer.v2010.is(event)) {
      return transfer.v2010.decode(event);
    } else {
      throw new UnknownVersionError(transfer);
    }
  }
}
