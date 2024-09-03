import { events } from '@/chain/moonbeam/types';
import { Event, IParachainRewardEventPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingRewardEventPalletDecoder implements IParachainRewardEventPalletDecoder {
  decode(event: Event) {
    const rewarded = events.parachainStaking.rewarded;
    if (rewarded.v900.is(event)) {
      const [stash, amount] = rewarded.v900.decode(event);
      return { stash, amount };
    } else if (rewarded.v1300.is(event)) {
      const { account, rewards } = rewarded.v1300.decode(event);
      return { stash: account, amount: rewards };
    } else {
      throw new UnknownVersionError(rewarded);
    }
  }
}
