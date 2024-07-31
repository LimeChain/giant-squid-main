import { events } from '@/chain/kusama/types';
import { Event, IContributedEventPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ContributedEventPalletDecoder implements IContributedEventPalletDecoder {
  decode(call: Event) {
    const { contributed } = events.crowdloan;

    if (contributed.v9010.is(call)) {
      const [who, paraId, amount] = contributed.v9010.decode(call);
      return { paraId, account: who, amount };
    }
    if (contributed.v9230.is(call)) {
      const { who, fundIndex, amount } = contributed.v9230.decode(call);
      return { paraId: fundIndex, account: who, amount };
    }

    throw new UnknownVersionError(contributed);
  }
}
