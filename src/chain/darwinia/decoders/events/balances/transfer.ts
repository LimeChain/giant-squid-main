import { events } from '../../../types';
import { Event } from '../../../../../indexer';
import { UnknownVersionError } from '../../../../../utils';
import { ITransferEventPalletDecoder } from '../../../../../indexer';

export class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
  decode(event: Event) {
    const { transfer } = events.balances;
    if (transfer.v6100.is(event)) {
      return transfer.v6100.decode(event);
    } else {
      throw new UnknownVersionError(transfer);
    }
  }
}
