import { events } from '@/chain/moonbeam/types';
import { UnknownVersionError } from '@/utils';
import { IEvmLogEventPalletDecoder, Event } from '@/indexer';
import { decodeNfts } from '@/indexer/pallets/nfts/evm/events/log';

export class EvmLogEventPalletDecoder implements IEvmLogEventPalletDecoder {
  decode(event: Event) {
    const { log } = events.evm;
    if (log.v900.is(event)) {
      const { address, topics } = log.v900.decode(event);

      return decodeNfts({ address, topics, event });
    } else if (log.v1802.is(event)) {
      const { log: _log } = log.v1802.decode(event);
      const { address, topics } = _log;

      return decodeNfts({ address, topics, event });
    }

    throw new UnknownVersionError(log);
  }
}
