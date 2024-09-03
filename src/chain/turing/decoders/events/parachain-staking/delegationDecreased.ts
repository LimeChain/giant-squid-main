import { events } from '@/chain/turing/types';
import { Event, IParachainDelegationDecreasedEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingDelegationDecreasedEventPalletDecoder implements IParachainDelegationDecreasedEventDecoder {
  decode(event: Event) {
    const delegationDecreased = events.parachainStaking.delegationDecreased;
    if (delegationDecreased.v280.is(event)) {
      const { delegator, candidate, amount } = delegationDecreased.v280.decode(event);
      return { delegator, stash: candidate, amount };
    } else {
      throw new UnknownVersionError(delegationDecreased);
    }
  }
}
