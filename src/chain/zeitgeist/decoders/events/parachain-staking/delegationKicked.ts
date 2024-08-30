import { events } from '@/chain/zeitgeist/types';
import { Event, IParachainDelegationKickedEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingDelegationKickedEventPalletDecoder implements IParachainDelegationKickedEventDecoder {
  decode(event: Event) {
    const delegationKicked = events.parachainStaking.delegationKicked;
    if (delegationKicked.v34.is(event)) {
      const [delegator, stash, amount] = delegationKicked.v34.decode(event);
      return { delegator, stash, amount };
    } else if (delegationKicked.v35.is(event)) {
      const { delegator, candidate, unstakedAmount } = delegationKicked.v35.decode(event);
      return { delegator, stash: candidate, amount: unstakedAmount };
    } else {
      throw new UnknownVersionError(delegationKicked);
    }
  }
}
