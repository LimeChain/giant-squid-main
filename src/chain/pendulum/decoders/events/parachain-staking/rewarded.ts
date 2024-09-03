import { events } from '@/chain/pendulum/types';
import { Event, IParachainRewardEventPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingRewardEventPalletDecoder implements IParachainRewardEventPalletDecoder {
  decode(event: Event) {
    const rewarded = events.parachainStaking.rewarded;
    if (rewarded.v1.is(event)) {
      const [stash, amount] = rewarded.v1.decode(event);
      return { stash, amount };
    } else {
      throw new UnknownVersionError(rewarded);
    }
  }
}
