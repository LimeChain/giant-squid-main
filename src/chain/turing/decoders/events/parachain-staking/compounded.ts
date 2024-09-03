import { events } from '@/chain/turing/types';
import { Event, IParachainCompoundEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingCompoundEventPalletDecoder implements IParachainCompoundEventDecoder {
  decode(event: Event) {
    const compounded = events.parachainStaking.compounded;

    if (compounded.v293.is(event)) {
      const { candidate, delegator, amount } = compounded.v293.decode(event);
      return { stash: candidate, delegator, amount };
    } else {
      throw new UnknownVersionError(compounded);
    }
  }
}
