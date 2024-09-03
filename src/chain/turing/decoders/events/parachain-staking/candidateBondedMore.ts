import { events } from '@/chain/turing/types';
import { Event, IParachainCandidateBondedMoreEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingCandidateBondedMoreEventPalletDecoder implements IParachainCandidateBondedMoreEventDecoder {
  decode(event: Event) {
    const candidateBondedMore = events.parachainStaking.candidateBondedMore;
    if (candidateBondedMore.v280.is(event)) {
      const { candidate, amount } = candidateBondedMore.v280.decode(event);
      return { stash: candidate, amount };
    } else {
      throw new UnknownVersionError(candidateBondedMore);
    }
  }
}
