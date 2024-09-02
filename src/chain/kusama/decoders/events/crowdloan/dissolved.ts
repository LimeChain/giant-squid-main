import { events } from '@/chain/kusama/types';
import { Event, IDissolvedEventPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class DissolvedEventPalletDecoder implements IDissolvedEventPalletDecoder {
  decode(call: Event) {
    const { dissolved } = events.crowdloan;

    if (dissolved.v9010.is(call)) {
      return { paraId: dissolved.v9010.decode(call) };
    }
    if (dissolved.v9230.is(call)) {
      return { paraId: dissolved.v9230.decode(call).paraId };
    }

    throw new UnknownVersionError(dissolved);
  }
}
