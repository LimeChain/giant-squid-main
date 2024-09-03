import { events } from '@/chain/zeitgeist/types';
import { Event, IParachainDelegationIncreasedEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingDelegationIncreasedEventPalletDecoder implements IParachainDelegationIncreasedEventDecoder {
  decode(event: Event) {
    const delegationIncreased = events.parachainStaking.delegationIncreased;
    if (delegationIncreased.v34.is(event)) {
      const [delegator, stash, amount] = delegationIncreased.v34.decode(event);
      return { delegator, stash, amount };
    } else if (delegationIncreased.v35.is(event)) {
      const { delegator, candidate, amount } = delegationIncreased.v35.decode(event);
      return { delegator, stash: candidate, amount };
    } else {
      throw new UnknownVersionError(delegationIncreased);
    }
  }
}
