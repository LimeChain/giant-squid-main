import { events } from '@/chain/zeitgeist/types';
import { Event, IParachainCompoundEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingCompoundEventPalletDecoder implements IParachainCompoundEventDecoder {
  decode(event: Event) {
    const compounded = events.parachainStaking.compounded;

    if (compounded.v42.is(event)) {
      const { candidate, delegator, amount } = compounded.v42.decode(event);
      return { stash: candidate, delegator, amount };
    } else {
      throw new UnknownVersionError(compounded);
    }
  }
}
