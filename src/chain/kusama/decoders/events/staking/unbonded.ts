import { events } from '@/chain/kusama/types';
import { UnknownVersionError } from '@/utils';
import { Event, IUnBondedEventPalletDecoder } from '@/indexer';

export class StakingUnBondedEventPalletDecoder implements IUnBondedEventPalletDecoder {
  decode(event: Event) {
    const unbonded = events.staking.unbonded;

    if (unbonded.v1051.is(event)) {
      let [stash, amount] = unbonded.v1051.decode(event);
      return { stash, amount };
    } else if (unbonded.v9300.is(event)) {
      return unbonded.v9300.decode(event);
    }

    throw new UnknownVersionError(unbonded);
  }
}
