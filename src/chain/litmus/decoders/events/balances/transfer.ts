import { events } from '@/chain/litmus/types';
import { UnknownVersionError } from '@/utils';
import { ITransferEventPalletDecoder, Event } from '@/indexer';

export class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
  decode(event: Event) {
    const { transfer } = events.balances;
    if (transfer.v9020.is(event)) {
      return transfer.v9020.decode(event);
    } else {
      throw new UnknownVersionError(transfer);
    }
  }
}
