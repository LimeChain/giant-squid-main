import { events } from '@/chain/integritee/types';
import { UnknownVersionError } from '@/utils';
import { ITransferEventPalletDecoder, Event } from '@/indexer';

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
