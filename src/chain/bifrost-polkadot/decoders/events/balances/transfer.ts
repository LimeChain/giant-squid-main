import { Event, ITransferEventPalletDecoder } from '../../../../../indexer';
import { UnknownVersionError } from '../../../../../utils';
import { events } from '../../../types';

export class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
  decode(event: Event) {
    const { transfer } = events.balances;
    if (transfer.v932.is(event)) {
      return transfer.v932.decode(event);
    } else {
      throw new UnknownVersionError(transfer);
    }
  }
}
