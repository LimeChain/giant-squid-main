import { events } from '../../../types';
import { UnknownVersionError } from '../../../../../utils';
import { Event, IRewardEventPalletDecoder } from '../../../../../indexer';

export class StakingRewardEventPalletDecoder implements IRewardEventPalletDecoder {
  decode(event: Event) {
    const reward = events.staking.reward;
    const rewarded = events.staking.rewarded;

    if (event.name === reward.name) {
      if (reward.v1020.is(event)) {
        return undefined;
      } else if (reward.v1050.is(event)) {
        let [stash, amount] = reward.v1050.decode(event);
        return { stash, amount };
      } else {
        throw new UnknownVersionError(reward);
      }
    }

    if (event.name === rewarded.name) {
      if (rewarded.v9090.is(event)) {
        let [stash, amount] = rewarded.v9090.decode(event);
        return { stash, amount };
      } else if (rewarded.v9300.is(event)) {
        return rewarded.v9300.decode(event);
      } else {
        throw new UnknownVersionError(rewarded);
      }
    }
  }
}
