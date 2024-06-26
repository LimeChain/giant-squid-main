import { events } from '@/chain/polkadot/types';
import { UnknownVersionError } from '@/utils';
import { ITransferEventPalletDecoder, Event } from '@/indexer';

export class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
  decode(event: Event) {
    const { transfer } = events.balances;
    if (transfer.v0.is(event)) {
      let [from, to, amount] = transfer.v0.decode(event);
      return { from, to, amount };
    } else if (transfer.v9140.is(event)) {
      return transfer.v9140.decode(event);
    } else {
      throw new UnknownVersionError(transfer);
    }
  }
}
