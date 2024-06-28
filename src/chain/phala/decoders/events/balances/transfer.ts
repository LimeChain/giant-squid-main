import { events } from '@/chain/phala/types';
import { UnknownVersionError } from '@/utils';
import { ITransferEventPalletDecoder, Event } from '@/indexer';

export class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
  decode(event: Event) {
    const { transfer } = events.balances;
    if (transfer.v1090.is(event)) {
      return transfer.v1090.decode(event);
    } else {
      throw new UnknownVersionError(transfer);
    }
  }
}
