import { events } from '@/chain/kusama/types';
import { Event, IVotedEventPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class VotedEventPalletDecoder implements IVotedEventPalletDecoder {
  decode(call: Event) {
    const { voted } = events.convictionVoting;

    if (voted.v1004000.is(call)) {
      const fund = voted.v1004000.decode(call);

      return { who: fund.who };
    }

    throw new UnknownVersionError(voted);
  }
}
