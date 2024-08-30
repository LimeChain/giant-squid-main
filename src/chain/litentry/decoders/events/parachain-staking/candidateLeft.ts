import { events } from '@/chain/litentry/types';
import { Event, IParachainCandidateLeftEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingCandidateLeftEventPalletDecoder implements IParachainCandidateLeftEventDecoder {
  decode(event: Event) {
    const candidateLeft = events.parachainStaking.candidateLeft;
    if (candidateLeft.v9100.is(event)) {
      const { exCandidate, unlockedAmount } = candidateLeft.v9100.decode(event);
      return { stash: exCandidate, amount: unlockedAmount };
    } else {
      throw new UnknownVersionError(candidateLeft);
    }
  }
}
