import { events } from '@/chain/moonriver/types';
import { UnknownVersionError } from '@/utils';
import { IEvmLogEventPalletDecoder, Event } from '@/indexer';
import { decodeNfts } from '@/indexer/pallets/nfts/evm/events/log';

export class EvmLogEventPalletDecoder implements IEvmLogEventPalletDecoder {
  decode(event: Event) {
    const { log } = events.evm;
    if (log.v49.is(event)) {
      const { address, topics } = log.v49.decode(event);

      return decodeNfts({ address, topics, event });
    } else if (log.v1801.is(event)) {
      const { log: _log } = log.v1801.decode(event);
      const { address, topics } = _log;

      return decodeNfts({ address, topics, event });
    }

    throw new UnknownVersionError(log);
  }
}
