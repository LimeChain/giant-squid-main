import { events } from '@/chain/turing/types';
import { UnknownVersionError } from '@/utils';
import { ITransferEventPalletDecoder, Event } from '@/indexer';

export class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
  decode(event: Event) {
    const { transfer } = events.balances;
    if (transfer.v277.is(event)) {
      return transfer.v277.decode(event);
    } else {
      throw new UnknownVersionError(transfer);
    }
  }
}
