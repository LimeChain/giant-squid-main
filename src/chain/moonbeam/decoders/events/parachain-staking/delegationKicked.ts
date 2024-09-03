import { events } from '@/chain/moonbeam/types';
import { Event, IParachainDelegationKickedEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingDelegationKickedEventPalletDecoder implements IParachainDelegationKickedEventDecoder {
  decode(event: Event) {
    const delegationKicked = events.parachainStaking.delegationKicked;
    if (delegationKicked.v1201.is(event)) {
      const [delegator, stash, amount] = delegationKicked.v1201.decode(event);
      return { delegator, stash, amount };
    } else if (delegationKicked.v1300.is(event)) {
      const { delegator, candidate, unstakedAmount } = delegationKicked.v1300.decode(event);
      return { delegator, stash: candidate, amount: unstakedAmount };
    } else {
      throw new UnknownVersionError(delegationKicked);
    }
  }
}
