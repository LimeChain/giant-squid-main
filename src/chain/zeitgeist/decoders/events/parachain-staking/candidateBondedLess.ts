import { events } from '@/chain/zeitgeist/types';
import { Event, IParachainCandidateBondedLessEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingCandidateBondedLessEventPalletDecoder implements IParachainCandidateBondedLessEventDecoder {
  decode(event: Event) {
    const candidateBondedLess = events.parachainStaking.candidateBondedLess;
    if (candidateBondedLess.v34.is(event)) {
      const [stash, amount] = candidateBondedLess.v34.decode(event);
      return { stash, amount };
    } else if (candidateBondedLess.v35.is(event)) {
      const { candidate, amount } = candidateBondedLess.v35.decode(event);
      return { stash: candidate, amount };
    } else {
      throw new UnknownVersionError(candidateBondedLess);
    }
  }
}
