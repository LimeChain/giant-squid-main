import { events } from '@/chain/zeitgeist/types';
import { Event, IParachainDelegationRevokedEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingDelegationRevokedEventPalletDecoder implements IParachainDelegationRevokedEventDecoder {
  decode(event: Event) {
    const delegationRevoked = events.parachainStaking.delegationRevoked;
    if (delegationRevoked.v34.is(event)) {
      const [delegator, stash, amount] = delegationRevoked.v34.decode(event);
      return { delegator, stash, amount };
    } else if (delegationRevoked.v35.is(event)) {
      const { delegator, candidate, unstakedAmount } = delegationRevoked.v35.decode(event);
      return { delegator, stash: candidate, amount: unstakedAmount };
    } else {
      throw new UnknownVersionError(delegationRevoked);
    }
  }
}
