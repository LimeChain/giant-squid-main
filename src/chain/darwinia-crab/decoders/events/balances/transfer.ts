import { events } from '@/chain/darwinia-crab/types';
import { UnknownVersionError } from '@/utils';
import { ITransferEventPalletDecoder, Event } from '@/indexer';

export class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
  decode(event: Event) {
    const { transfer } = events.balances;
    if (transfer.v6000.is(event)) {
      return transfer.v6000.decode(event);
    } else {
      throw new UnknownVersionError(transfer);
    }
  }
}
