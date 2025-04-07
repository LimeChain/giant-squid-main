import { events } from '@/chain/kusama/types';
import { Event, IUndelegatedEventPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class UndelegatedEventPalletDecoder implements IUndelegatedEventPalletDecoder {
  decode(call: Event) {
    const { undelegated } = events.convictionVoting;

    if (undelegated.v9320.is(call)) {
      const fund = undelegated.v9320.decode(call);

      return { accountId: fund };
    }

    throw new UnknownVersionError(undelegated);
  }
}
