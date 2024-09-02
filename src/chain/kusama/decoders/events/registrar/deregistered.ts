import { events } from '@/chain/kusama/types';
import { Event, IDeregisteredParachainEventPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class DeregisteredEventPalletDecoder implements IDeregisteredParachainEventPalletDecoder {
  decode(call: Event) {
    const { deregistered } = events.registrar;

    if (deregistered.v9010.is(call)) {
      const paraId = deregistered.v9010.decode(call);
      return { paraId };
    }
    if (deregistered.v9230.is(call)) {
      const { paraId } = deregistered.v9230.decode(call);
      return { paraId };
    }

    throw new UnknownVersionError(deregistered);
  }
}
