import { events } from '@/chain/polkadot/types';
import { Event, IReservedParachainEventPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ReservedEventPalletDecoder implements IReservedParachainEventPalletDecoder {
  decode(call: Event) {
    const { reserved } = events.registrar;

    if (reserved.v9110.is(call)) {
      const [paraId, owner] = reserved.v9110.decode(call);
      return { paraId, owner };
    }
    if (reserved.v9230.is(call)) {
      const { paraId, who } = reserved.v9230.decode(call);
      return { paraId, owner: who };
    }

    throw new UnknownVersionError(reserved);
  }
}
