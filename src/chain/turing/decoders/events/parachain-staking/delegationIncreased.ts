import { events } from '@/chain/turing/types';
import { Event, IParachainDelegationIncreasedEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingDelegationIncreasedEventPalletDecoder implements IParachainDelegationIncreasedEventDecoder {
  decode(event: Event) {
    const delegationIncreased = events.parachainStaking.delegationIncreased;
    if (delegationIncreased.v280.is(event)) {
      const { delegator, candidate, amount } = delegationIncreased.v280.decode(event);
      return { delegator, stash: candidate, amount };
    } else {
      throw new UnknownVersionError(delegationIncreased);
    }
  }
}
