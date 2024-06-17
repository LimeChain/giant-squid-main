import { Event } from '@subsquid/substrate-processor';
import { UnknownVersionError } from '../../../../../utils';
import { events } from '../../../types';
import { ITransferEventPalletDecoder } from '../../../../../indexer/registry';

export class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
  decode(event: Event): { from: string; to: string; amount: bigint } {
    const { transfer } = events.balances;
    if (transfer.v26.is(event)) {
      let [from, to, amount] = transfer.v26.decode(event);
      return { from, to, amount };
    } else if (transfer.v34.is(event)) {
      return transfer.v34.decode(event);
    } else {
      throw new UnknownVersionError(transfer);
    }
  }
}
