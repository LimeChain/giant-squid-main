import { events } from '@/chain/litentry/types';
import { Event, IParachainDelegationKickedEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingDelegationKickedEventPalletDecoder implements IParachainDelegationKickedEventDecoder {
  decode(event: Event) {
    const delegationKicked = events.parachainStaking.delegationKicked;
    if (delegationKicked.v9100.is(event)) {
      const { delegator, candidate, unstakedAmount } = delegationKicked.v9100.decode(event);
      return { delegator, stash: candidate, amount: unstakedAmount };
    } else {
      throw new UnknownVersionError(delegationKicked);
    }
  }
}
