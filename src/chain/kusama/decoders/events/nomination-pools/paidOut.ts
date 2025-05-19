import { events } from '@/chain/kusama/types';
import { UnknownVersionError } from '@/utils';
import { Event, INominationPoolsPaidOutEventPalletDecoder } from '@/indexer';

export class NominationPoolsPaidOutEventPalletDecoder implements INominationPoolsPaidOutEventPalletDecoder {
  decode(event: Event) {
    const { paidOut } = events.nominationPools;

    if (paidOut.v9220.is(event)) {
      const data = paidOut.v9220.decode(event);

      return {
        member: data.member,
        poolId: data.poolId.toString(),
        payout: data.payout,
      };
    }

    throw new UnknownVersionError(paidOut);
  }
}
