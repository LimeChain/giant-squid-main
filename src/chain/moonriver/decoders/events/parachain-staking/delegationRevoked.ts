import { events } from '@/chain/moonriver/types';
import { Event, IParachainDelegationRevokedEventDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingDelegationRevokedEventPalletDecoder implements IParachainDelegationRevokedEventDecoder {
  decode(event: Event) {
    const delegationRevoked = events.parachainStaking.delegationRevoked;
    if (delegationRevoked.v1001.is(event)) {
      const [delegator, stash, amount] = delegationRevoked.v1001.decode(event);
      return { delegator, stash, amount };
    } else if (delegationRevoked.v1300.is(event)) {
      const { delegator, candidate, unstakedAmount } = delegationRevoked.v1300.decode(event);
      return { delegator, stash: candidate, amount: unstakedAmount };
    } else {
      throw new UnknownVersionError(delegationRevoked);
    }
  }
}
