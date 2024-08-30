import { events } from '@/chain/zeitgeist/types';
import { Event, IParachainCandidateLeftEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingCandidateLeftEventPalletDecoder implements IParachainCandidateLeftEventDecoder {
  decode(event: Event) {
    const candidateLeft = events.parachainStaking.candidateLeft;
    if (candidateLeft.v34.is(event)) {
      const [stash, amount] = candidateLeft.v34.decode(event);
      return { stash, amount };
    } else if (candidateLeft.v35.is(event)) {
      const { exCandidate, unlockedAmount } = candidateLeft.v35.decode(event);
      return { stash: exCandidate, amount: unlockedAmount };
    } else {
      throw new UnknownVersionError(candidateLeft);
    }
  }
}
