import { events } from '@/chain/zeitgeist/types';
import { Event, IParachainDelegationDecreasedEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingDelegationDecreasedEventPalletDecoder implements IParachainDelegationDecreasedEventDecoder {
  decode(event: Event) {
    const delegationDecreased = events.parachainStaking.delegationDecreased;
    if (delegationDecreased.v34.is(event)) {
      const [delegator, stash, amount] = delegationDecreased.v34.decode(event);
      return { delegator, stash, amount };
    } else if (delegationDecreased.v35.is(event)) {
      const { delegator, candidate, amount } = delegationDecreased.v35.decode(event);
      return { delegator, stash: candidate, amount };
    } else {
      throw new UnknownVersionError(delegationDecreased);
    }
  }
}
