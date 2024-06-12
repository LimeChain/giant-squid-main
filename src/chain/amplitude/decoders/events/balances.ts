import { events } from '../../types';
import { Event } from '@subsquid/substrate-processor';
import { UnknownVersionError } from '../../../../utils';
import { ITransferEventPalletDecoder } from '../../../../indexer/registry';

export class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
  decode(event: Event): { from: string; to: string; amount: bigint } {
    const { transfer } = events.balances;
    if (transfer.v1.is(event)) {
      return transfer.v1.decode(event);
    } else {
      throw new UnknownVersionError(event);
    }
  }
}
