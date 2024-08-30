import { events } from '@/chain/litentry/types';
import { Event, IParachainDelegationEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingDelegationEventPalletDecoder implements IParachainDelegationEventDecoder {
  decode(event: Event) {
    const delegation = events.parachainStaking.delegation;
    if (delegation.v9100.is(event)) {
      const { delegator, lockedAmount, candidate, delegatorPosition } = delegation.v9100.decode(event);
      return { delegator, amount: lockedAmount, stash: candidate, delegatorPosition };
    } else if (delegation.v9135.is(event)) {
      const { delegator, lockedAmount, candidate, delegatorPosition, autoCompound } = delegation.v9135.decode(event);
      return { delegator, amount: lockedAmount, stash: candidate, delegatorPosition, autoCompundPercent: autoCompound };
    } else {
      throw new UnknownVersionError(delegation);
    }
  }
}
