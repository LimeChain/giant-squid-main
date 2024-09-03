import { events } from '@/chain/moonbeam/types';
import { Event, IParachainDelegationDecreasedEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingDelegationDecreasedEventPalletDecoder implements IParachainDelegationDecreasedEventDecoder {
  decode(event: Event) {
    const delegationDecreased = events.parachainStaking.delegationDecreased;
    if (delegationDecreased.v1001.is(event)) {
      const [delegator, stash, amount] = delegationDecreased.v1001.decode(event);
      return { delegator, stash, amount };
    } else if (delegationDecreased.v1300.is(event)) {
      const { delegator, candidate, amount } = delegationDecreased.v1300.decode(event);
      return { delegator, stash: candidate, amount };
    } else {
      throw new UnknownVersionError(delegationDecreased);
    }
  }
}
