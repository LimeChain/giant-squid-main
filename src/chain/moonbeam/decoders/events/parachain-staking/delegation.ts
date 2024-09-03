import { events } from '@/chain/moonbeam/types';
import { Event, IParachainDelegationEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingDelegationEventPalletDecoder implements IParachainDelegationEventDecoder {
  decode(event: Event) {
    const delegation = events.parachainStaking.delegation;
    if (delegation.v1001.is(event)) {
      const [delegator, amount, stash, delegatorPosition] = delegation.v1001.decode(event);
      return { delegator, amount, stash, delegatorPosition };
    } else if (delegation.v1300.is(event)) {
      const { delegator, lockedAmount, candidate, delegatorPosition } = delegation.v1300.decode(event);
      return { delegator, amount: lockedAmount, stash: candidate, delegatorPosition };
    } else if (delegation.v1901.is(event)) {
      const { delegator, lockedAmount, candidate, delegatorPosition, autoCompound } = delegation.v1901.decode(event);
      return { delegator, amount: lockedAmount, stash: candidate, delegatorPosition, autoCompundPercent: autoCompound };
    } else {
      throw new UnknownVersionError(delegation);
    }
  }
}
