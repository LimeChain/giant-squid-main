import { events } from '@/chain/zeitgeist/types';
import { Event, IParachainCandidateBondedMoreEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingCandidateBondedMoreEventPalletDecoder implements IParachainCandidateBondedMoreEventDecoder {
  decode(event: Event) {
    const candidateBondedMore = events.parachainStaking.candidateBondedMore;
    if (candidateBondedMore.v34.is(event)) {
      const [stash, amount] = candidateBondedMore.v34.decode(event);
      return { stash, amount };
    } else if (candidateBondedMore.v35.is(event)) {
      const { candidate, amount } = candidateBondedMore.v35.decode(event);
      return { stash: candidate, amount };
    } else {
      throw new UnknownVersionError(candidateBondedMore);
    }
  }
}
