import { events } from '@/chain/darwinia/types';
import { UnknownVersionError } from '@/utils';
import { IEvmLogEventPalletDecoder, Event } from '@/indexer';
import { decodeNfts } from '@/indexer/pallets/nfts/evm/events/log';

export class EvmLogEventPalletDecoder implements IEvmLogEventPalletDecoder {
  decode(event: Event) {
    const { log } = events.evm;
    if (log.v6100.is(event)) {
      const { log: _log } = log.v6100.decode(event);
      const { address, topics } = _log;

      return decodeNfts({ address, topics, event });
    }
    throw new UnknownVersionError(log);
  }
}
