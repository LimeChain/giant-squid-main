import { events } from '@/chain/litentry/types';
import { Event, IParachainDelegationRevokedEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingDelegationRevokedEventPalletDecoder implements IParachainDelegationRevokedEventDecoder {
  decode(event: Event) {
    const delegationRevoked = events.parachainStaking.delegationRevoked;
    if (delegationRevoked.v9100.is(event)) {
      const { delegator, candidate, unstakedAmount } = delegationRevoked.v9100.decode(event);
      return { delegator, stash: candidate, amount: unstakedAmount };
    } else {
      throw new UnknownVersionError(delegationRevoked);
    }
  }
}
