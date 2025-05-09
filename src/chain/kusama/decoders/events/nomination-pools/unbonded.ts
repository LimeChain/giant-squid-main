import { events } from '@/chain/kusama/types';
import { UnknownVersionError } from '@/utils';
import { Event, INominationPoolsUnbondedEventPalletDecoder } from '@/indexer';

export class NominationPoolsUnbondedEventPalletDecoder implements INominationPoolsUnbondedEventPalletDecoder {
  decode(event: Event) {
    const { unbonded } = events.nominationPools;

    if (unbonded.v9220.is(event)) {
      const data = unbonded.v9220.decode(event);

      return {
        member: data.member,
        poolId: data.poolId.toString(),
        balance: undefined,
        points: undefined,
        era: undefined,
      };
    } else if (unbonded.v9250.is(event)) {
      const data = unbonded.v9250.decode(event);

      return {
        member: data.member,
        poolId: data.poolId.toString(),
        balance: data.balance,
        points: data.points,
      };
    } else if (unbonded.v9271.is(event)) {
      const data = unbonded.v9271.decode(event);
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
