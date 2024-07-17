import { events } from '@/chain/kusama/types';
import { UnknownVersionError } from '@/utils';
import { Event, IWithdrawnEventPalletDecoder } from '@/indexer';

export class StakingWithdrawnEventPalletDecoder implements IWithdrawnEventPalletDecoder {
  decode(event: Event) {
    const withdrawn = events.staking.withdrawn;

    if (withdrawn.v1051.is(event)) {
      let [stash, amount] = withdrawn.v1051.decode(event);
      return { stash, amount };
    } else if (withdrawn.v9300.is(event)) {
      return withdrawn.v9300.decode(event);
    }

    throw new UnknownVersionError(withdrawn);
  }
}
