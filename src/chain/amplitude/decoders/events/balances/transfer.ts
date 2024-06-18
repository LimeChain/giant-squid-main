import { events } from '../../../types';
import { UnknownVersionError } from '../../../../../utils';
import { Event, ITransferEventPalletDecoder } from '../../../../../indexer';

export class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
  decode(event: Event) {
    const { transfer } = events.balances;
    if (transfer.v1.is(event)) {
      return transfer.v1.decode(event);
    } else {
      throw new UnknownVersionError(event);
    }
  }
}
