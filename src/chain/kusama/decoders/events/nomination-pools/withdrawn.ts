import { events } from '@/chain/kusama/types';
import { UnknownVersionError } from '@/utils';
import { Event, INominationPoolsWithdrawnEventPalletDecoder } from '@/indexer';

export class NominationPoolsWithdrawnEventPalletDecoder implements INominationPoolsWithdrawnEventPalletDecoder {
  decode(event: Event) {
    const { withdrawn } = events.nominationPools;

    if (withdrawn.v9220.is(event)) {
      const data = withdrawn.v9220.decode(event);

      return {
        member: data.member,
        poolId: data.poolId.toString(),
        balance: data.amount,
      };
    } else if (withdrawn.v9250.is(event)) {
      const data = withdrawn.v9250.decode(event);

      return {
        member: data.member,
        poolId: data.poolId.toString(),
        balance: data.balance,
        points: data.points,
      };
    }

    throw new UnknownVersionError(withdrawn);
  }
}
