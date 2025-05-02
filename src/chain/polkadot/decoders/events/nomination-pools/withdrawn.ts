import { events } from '@/chain/polkadot/types';
import { UnknownVersionError } from '@/utils';
import { Event, INominationPoolsWithdrawnEventPalletDecoder } from '@/indexer';

export class NominationPoolsWithdrawnEventPalletDecoder implements INominationPoolsWithdrawnEventPalletDecoder {
  decode(event: Event) {
    const { withdrawn } = events.nominationPools;

    if (withdrawn.v9280.is(event)) {
      const data = withdrawn.v9280.decode(event);

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
