import { events } from '@/chain/kusama/types';
import { Event, IWithdrewEventPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class WithdrewEventPalletDecoder implements IWithdrewEventPalletDecoder {
  decode(call: Event) {
    const { withdrew } = events.crowdloan;

    if (withdrew.v9010.is(call)) {
      const [who, paraId] = withdrew.v9010.decode(call);
      return { paraId, account: who };
    }
    if (withdrew.v9230.is(call)) {
      const { who, fundIndex } = withdrew.v9230.decode(call);
      return { paraId: fundIndex, account: who };
    }

    throw new UnknownVersionError(withdrew);
  }
}
