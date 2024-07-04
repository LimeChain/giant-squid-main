import { events } from '@/chain/kusama/types';
import { UnknownVersionError } from '@/utils';
import { Event, IBondedEventPalletDecoder } from '@/indexer';

export class StakingBondedEventPalletDecoder implements IBondedEventPalletDecoder {
  decode(event: Event) {
    const bonded = events.staking.bonded;

    if (bonded.v1051.is(event)) {
      let [stash, amount] = bonded.v1051.decode(event);
      return { stash, amount };
    } else if (bonded.v9300.is(event)) {
      return bonded.v9300.decode(event);
    }

    throw new UnknownVersionError(bonded);
  }
}
