import { events } from '@/chain/polkadot/types';
import { UnknownVersionError } from '@/utils';
import { Event, INominationPoolsUnbondedEventPalletDecoder } from '@/indexer';

export class NominationPoolsUnbondedEventPalletDecoder implements INominationPoolsUnbondedEventPalletDecoder {
  decode(event: Event) {
    const { unbonded } = events.nominationPools;

    if (unbonded.v9280.is(event)) {
      const data = unbonded.v9280.decode(event);

      return {
        member: data.member,
        poolId: data.poolId.toString(),
        balance: data.balance,
        points: data.points,
        era: data.era,
      };
    }

    throw new UnknownVersionError(unbonded);
  }
}
