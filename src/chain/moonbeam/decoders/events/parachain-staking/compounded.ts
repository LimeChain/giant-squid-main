import { events } from '@/chain/moonbeam/types';
import { Event, IParachainCompoundEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingCompoundEventPalletDecoder implements IParachainCompoundEventDecoder {
  decode(event: Event) {
    const compounded = events.parachainStaking.compounded;

    if (compounded.v1901.is(event)) {
      const { candidate, delegator, amount } = compounded.v1901.decode(event);
      return { stash: candidate, delegator, amount };
    } else {
      throw new UnknownVersionError(compounded);
    }
  }
}
