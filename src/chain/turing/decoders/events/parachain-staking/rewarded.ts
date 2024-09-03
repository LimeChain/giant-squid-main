import { events } from '@/chain/turing/types';
import { Event, IParachainRewardEventPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingRewardEventPalletDecoder implements IParachainRewardEventPalletDecoder {
  decode(event: Event) {
    const rewarded = events.parachainStaking.rewarded;
    if (rewarded.v280.is(event)) {
      const { account, rewards } = rewarded.v280.decode(event);
      return { stash: account, amount: rewards };
    } else {
      throw new UnknownVersionError(rewarded);
    }
  }
}
