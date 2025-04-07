import { events } from '@/chain/polkadot/types';
import { Event, IUndelegatedEventPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class UndelegatedEventPalletDecoder implements IUndelegatedEventPalletDecoder {
  decode(call: Event) {
    const { undelegated } = events.convictionVoting;

    if (undelegated.v9420.is(call)) {
      const fund = undelegated.v9420.decode(call);

      return { accountId: fund };
    }

    throw new UnknownVersionError(undelegated);
  }
}
