import { events } from '@/chain/kusama/types';
import { UnknownVersionError } from '@/utils';
import { Event, ISlashEventPalletDecoder } from '@/indexer';

export class StakingSlashEventPalletDecoder implements ISlashEventPalletDecoder {
  decode(event: Event) {
    const slash = events.staking.slash;
    const slashed = events.staking.slashed;

    if (event.name === slash.name) {
      if (slash.v1020.is(event)) {
        let [staker, amount] = slash.v1020.decode(event);
        return { staker, amount };
      }
    }

    if (event.name === slashed.name) {
      if (slashed.v9090.is(event)) {
        let [staker, amount] = slashed.v9090.decode(event);
        return { staker, amount };
      } else if (slashed.v9300.is(event)) {
        return slashed.v9300.decode(event);
      }
    }

    throw new UnknownVersionError(slashed);
  }
}
