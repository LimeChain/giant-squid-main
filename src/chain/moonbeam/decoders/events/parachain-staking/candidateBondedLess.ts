import { events } from '@/chain/moonbeam/types';
import { Event, IParachainCandidateBondedLessEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingCandidateBondedLessEventPalletDecoder implements IParachainCandidateBondedLessEventDecoder {
  decode(event: Event) {
    const candidateBondedLess = events.parachainStaking.candidateBondedLess;
    if (candidateBondedLess.v1001.is(event)) {
      const [stash, amount] = candidateBondedLess.v1001.decode(event);
      return { stash, amount };
    } else if (candidateBondedLess.v1300.is(event)) {
      const { candidate, amount } = candidateBondedLess.v1300.decode(event);
      return { stash: candidate, amount };
    } else {
      throw new UnknownVersionError(candidateBondedLess);
    }
  }
}
