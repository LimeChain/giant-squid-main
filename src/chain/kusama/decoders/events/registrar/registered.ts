import { events } from '@/chain/kusama/types';
import { Event, IRegisteredParachainEventPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class RegisteredEventPalletDecoder implements IRegisteredParachainEventPalletDecoder {
  decode(call: Event) {
    const { registered } = events.registrar;

    if (registered.v9010.is(call)) {
      const [paraId, owner] = registered.v9010.decode(call);
      return { paraId, owner };
    }
    if (registered.v9230.is(call)) {
      const { paraId, manager } = registered.v9230.decode(call);
      return { paraId, owner: manager };
    }

    throw new UnknownVersionError(registered);
  }
}
