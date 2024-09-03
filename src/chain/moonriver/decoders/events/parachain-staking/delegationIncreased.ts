import { events } from '@/chain/moonriver/types';
import { Event, IParachainDelegationIncreasedEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingDelegationIncreasedEventPalletDecoder implements IParachainDelegationIncreasedEventDecoder {
  decode(event: Event) {
    const delegationIncreased = events.parachainStaking.delegationIncreased;
    if (delegationIncreased.v1001.is(event)) {
      const [delegator, stash, amount] = delegationIncreased.v1001.decode(event);
      return { delegator, stash, amount };
    } else if (delegationIncreased.v1300.is(event)) {
      const { delegator, candidate, amount } = delegationIncreased.v1300.decode(event);
      return { delegator, stash: candidate, amount };
    } else {
      throw new UnknownVersionError(delegationIncreased);
    }
  }
}
