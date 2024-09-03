import { events } from '@/chain/zeitgeist/types';
import { Event, IParachainRewardEventPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingRewardEventPalletDecoder implements IParachainRewardEventPalletDecoder {
  decode(event: Event) {
    const rewarded = events.parachainStaking.rewarded;
    if (rewarded.v26.is(event)) {
      const [stash, amount] = rewarded.v26.decode(event);
      return { stash, amount };
    } else if (rewarded.v35.is(event)) {
      const { account, rewards } = rewarded.v35.decode(event);
      return { stash: account, amount: rewards };
    } else {
      throw new UnknownVersionError(rewarded);
    }
  }
}
