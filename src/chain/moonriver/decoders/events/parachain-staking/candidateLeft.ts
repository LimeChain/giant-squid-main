import { events } from '@/chain/moonriver/types';
import { Event, IParachainCandidateLeftEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingCandidateLeftEventPalletDecoder implements IParachainCandidateLeftEventDecoder {
  decode(event: Event) {
    const candidateLeft = events.parachainStaking.candidateLeft;
    if (candidateLeft.v1001.is(event)) {
      const [stash, amount] = candidateLeft.v1001.decode(event);
      return { stash, amount };
    } else if (candidateLeft.v1300.is(event)) {
      const { exCandidate, unlockedAmount } = candidateLeft.v1300.decode(event);
      return { stash: exCandidate, amount: unlockedAmount };
    } else {
      throw new UnknownVersionError(candidateLeft);
    }
  }
}
