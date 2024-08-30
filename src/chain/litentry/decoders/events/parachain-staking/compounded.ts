import { events } from '@/chain/litentry/types';
import { Event, IParachainCompoundEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingCompoundEventPalletDecoder implements IParachainCompoundEventDecoder {
  decode(event: Event) {
    const compounded = events.parachainStaking.compounded;

    if (compounded.v9135.is(event)) {
      const { candidate, delegator, amount } = compounded.v9135.decode(event);
      return { stash: candidate, delegator, amount };
    } else {
      throw new UnknownVersionError(compounded);
    }
  }
}
