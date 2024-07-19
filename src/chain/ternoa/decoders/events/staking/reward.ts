import { events } from '@/chain/ternoa/types';
import { UnknownVersionError } from '@/utils';
import { Event, IRewardEventPalletDecoder } from '@/indexer';

export class StakingRewardEventPalletDecoder implements IRewardEventPalletDecoder {
  decode(event: Event) {
    const { rewarded } = events.staking;
    if (rewarded.v1.is(event)) {
      let [stash, amount] = rewarded.v1.decode(event);
      return { stash, amount };
    } else if (rewarded.v11.is(event)) {
      return rewarded.v11.decode(event);
    } else {
      throw new UnknownVersionError(rewarded);
    }
  }
}
