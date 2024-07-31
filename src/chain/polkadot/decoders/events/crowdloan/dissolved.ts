import { events } from '@/chain/polkadot/types';
import { Event, IDissolvedEventPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class DissolvedEventPalletDecoder implements IDissolvedEventPalletDecoder {
  decode(call: Event) {
    const { dissolved } = events.crowdloan;

    if (dissolved.v9110.is(call)) {
      return { paraId: dissolved.v9110.decode(call) };
    }
    if (dissolved.v9230.is(call)) {
      return { paraId: dissolved.v9230.decode(call).paraId };
    }

    throw new UnknownVersionError(dissolved);
  }
}
