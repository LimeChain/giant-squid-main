import { events } from '../../../types';
import { Event } from '../../../../../indexer';
import { UnknownVersionError } from '../../../../../utils';
import { ITransferEventPalletDecoder } from '../../../../../indexer';

export class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
  decode(event: Event) {
    const { transfer } = events.balances;
    if (transfer.v3.is(event)) {
      return transfer.v3.decode(event);
    } else {
      throw new UnknownVersionError(transfer);
    }
  }
}
