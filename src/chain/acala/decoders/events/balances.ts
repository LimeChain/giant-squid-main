import { events } from '../../types';
import { Event } from '@subsquid/substrate-processor';
import { UnknownVersionError } from '../../../../utils';
import { ITransferEventPalletDecoder } from '../../../../indexer/registry';

export class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
  decode(event: Event): { from: string; to: string; amount: bigint } {
    const transfer = events.balances.transfer;
    if (transfer.v2000.is(event)) {
      let [from, to, amount] = transfer.v2000.decode(event);
      return { from, to, amount };
    } else if (transfer.v2011.is(event)) {
      return transfer.v2011.decode(event);
    } else {
      throw new UnknownVersionError(transfer);
    }
  }
}
