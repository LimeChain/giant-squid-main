import { events } from '@/chain/polkadex/types';
import { UnknownVersionError } from '@/utils';
import { Event, IRewardEventPalletDecoder } from '@/indexer';

export class StakingRewardEventPalletDecoder implements IRewardEventPalletDecoder {
  decode(event: Event) {
    const { rewarded } = events.staking;
    if (rewarded.v268.is(event)) {
      let [stash, amount] = rewarded.v268.decode(event);
      return { stash, amount };
    } else if (rewarded.v283.is(event)) {
      return rewarded.v283.decode(event);
    } else {
      throw new UnknownVersionError(rewarded);
    }
  }
}
