import { events } from '@/chain/moonriver/types';
import { UnknownVersionError } from '@/utils';
import { ITransferEventPalletDecoder, Event } from '@/indexer';

export class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
  decode(event: Event) {
    const { transfer } = events.balances;
    if (transfer.v49.is(event)) {
      let [from, to, amount] = transfer.v49.decode(event);
      return { from, to, amount };
    } else if (transfer.v1201.is(event)) {
      return transfer.v1201.decode(event);
    } else {
      throw new UnknownVersionError(transfer);
    }
  }
}
