import { events } from '@/chain/moonbeam/types';
import { Event, IParachainCandidateBondedMoreEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingCandidateBondedMoreEventPalletDecoder implements IParachainCandidateBondedMoreEventDecoder {
  decode(event: Event) {
    const candidateBondedMore = events.parachainStaking.candidateBondedMore;
    if (candidateBondedMore.v1001.is(event)) {
      const [stash, amount] = candidateBondedMore.v1001.decode(event);
      return { stash, amount };
    } else if (candidateBondedMore.v1300.is(event)) {
      const { candidate, amount } = candidateBondedMore.v1300.decode(event);
      return { stash: candidate, amount };
    } else {
      throw new UnknownVersionError(candidateBondedMore);
    }
  }
}
