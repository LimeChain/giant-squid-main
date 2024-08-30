import { events } from '@/chain/zeitgeist/types';
import { Event, IParachainDelegationEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingDelegationEventPalletDecoder implements IParachainDelegationEventDecoder {
  decode(event: Event) {
    const delegation = events.parachainStaking.delegation;
    if (delegation.v34.is(event)) {
      const [delegator, amount, stash, delegatorPosition] = delegation.v34.decode(event);
      return { delegator, amount, stash, delegatorPosition };
    } else if (delegation.v35.is(event)) {
      const { delegator, lockedAmount, candidate, delegatorPosition } = delegation.v35.decode(event);
      return { delegator, amount: lockedAmount, stash: candidate, delegatorPosition };
    } else if (delegation.v42.is(event)) {
      const { delegator, lockedAmount, candidate, delegatorPosition, autoCompound } = delegation.v42.decode(event);
      return { delegator, amount: lockedAmount, stash: candidate, delegatorPosition, autoCompundPercent: autoCompound };
    } else {
      throw new UnknownVersionError(delegation);
    }
  }
}
