import { events } from '@/chain/polkadot/types';
import { Event, IDeregisteredParachainEventPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class DeregisteredEventPalletDecoder implements IDeregisteredParachainEventPalletDecoder {
  decode(call: Event) {
    const { deregistered } = events.registrar;

    if (deregistered.v9110.is(call)) {
      const paraId = deregistered.v9110.decode(call);
      return { paraId };
    }
    if (deregistered.v9230.is(call)) {
      const { paraId } = deregistered.v9230.decode(call);
      return { paraId };
    }

    throw new UnknownVersionError(deregistered);
  }
}
