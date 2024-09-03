import { events } from '@/chain/litentry/types';
import { Event, IParachainDelegationIncreasedEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingDelegationIncreasedEventPalletDecoder implements IParachainDelegationIncreasedEventDecoder {
  decode(event: Event) {
    const delegationIncreased = events.parachainStaking.delegationIncreased;
    if (delegationIncreased.v9100.is(event)) {
      const { delegator, candidate, amount } = delegationIncreased.v9100.decode(event);
      return { delegator, stash: candidate, amount };
    } else {
      throw new UnknownVersionError(delegationIncreased);
    }
  }
}
