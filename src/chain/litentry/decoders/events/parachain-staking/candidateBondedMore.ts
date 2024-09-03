import { events } from '@/chain/litentry/types';
import { Event, IParachainCandidateBondedMoreEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingCandidateBondedMoreEventPalletDecoder implements IParachainCandidateBondedMoreEventDecoder {
  decode(event: Event) {
    const candidateBondedMore = events.parachainStaking.candidateBondedMore;
    if (candidateBondedMore.v9100.is(event)) {
      const { candidate, amount } = candidateBondedMore.v9100.decode(event);
      return { stash: candidate, amount };
    } else {
      throw new UnknownVersionError(candidateBondedMore);
    }
  }
}
