import { events } from '@/chain/turing/types';
import { Event, IParachainDelegationEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingDelegationEventPalletDecoder implements IParachainDelegationEventDecoder {
  decode(event: Event) {
    const delegation = events.parachainStaking.delegation;
    if (delegation.v280.is(event)) {
      const { delegator, lockedAmount, candidate, delegatorPosition } = delegation.v280.decode(event);
      return { delegator, amount: lockedAmount, stash: candidate, delegatorPosition };
    } else if (delegation.v293.is(event)) {
      const { delegator, lockedAmount, candidate, delegatorPosition, autoCompound } = delegation.v293.decode(event);
      return { delegator, amount: lockedAmount, stash: candidate, delegatorPosition, autoCompundPercent: autoCompound };
    } else {
      throw new UnknownVersionError(delegation);
    }
  }
}
