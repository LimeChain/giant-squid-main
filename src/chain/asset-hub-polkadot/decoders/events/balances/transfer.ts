import { events } from '@/chain/asset-hub-polkadot/types';
import { UnknownVersionError } from '@/utils';
import { Event, ITransferEventPalletDecoder } from '@/indexer';

export class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
  decode(event: Event) {
    const transfer = events.balances.transfer;
    if (transfer.v601.is(event)) {
      let [from, to, amount] = transfer.v601.decode(event);
      return { from, to, amount };
    } else if (transfer.v700.is(event)) {
      let { from, to, amount } = transfer.v700.decode(event);
      return { from, to, amount };
    } else {
      throw new UnknownVersionError(transfer);
    }
  }
}
