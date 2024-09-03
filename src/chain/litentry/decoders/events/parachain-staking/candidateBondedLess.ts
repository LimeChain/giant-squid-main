import { events } from '@/chain/litentry/types';
import { Event, IParachainCandidateBondedLessEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingCandidateBondedLessEventPalletDecoder implements IParachainCandidateBondedLessEventDecoder {
  decode(event: Event) {
    const candidateBondedLess = events.parachainStaking.candidateBondedLess;
    if (candidateBondedLess.v9100.is(event)) {
      const { candidate, amount } = candidateBondedLess.v9100.decode(event);
      return { stash: candidate, amount };
    } else {
      throw new UnknownVersionError(candidateBondedLess);
    }
  }
}
