import { events } from '@/chain/turing/types';
import { Event, IParachainCandidateBondedLessEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingCandidateBondedLessEventPalletDecoder implements IParachainCandidateBondedLessEventDecoder {
  decode(event: Event) {
    const candidateBondedLess = events.parachainStaking.candidateBondedLess;
    if (candidateBondedLess.v280.is(event)) {
      const { candidate, amount } = candidateBondedLess.v280.decode(event);
      return { stash: candidate, amount };
    } else {
      throw new UnknownVersionError(candidateBondedLess);
    }
  }
}
