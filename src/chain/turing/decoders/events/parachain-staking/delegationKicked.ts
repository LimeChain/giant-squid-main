import { events } from '@/chain/turing/types';
import { Event, IParachainDelegationKickedEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingDelegationKickedEventPalletDecoder implements IParachainDelegationKickedEventDecoder {
  decode(event: Event) {
    const delegationKicked = events.parachainStaking.delegationKicked;
    if (delegationKicked.v280.is(event)) {
      const { delegator, candidate, unstakedAmount } = delegationKicked.v280.decode(event);
      return { delegator, stash: candidate, amount: unstakedAmount };
    } else {
      throw new UnknownVersionError(delegationKicked);
    }
  }
}
