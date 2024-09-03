import { events } from '@/chain/litentry/types';
import { Event, IParachainRewardEventPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class ParachainStakingRewardEventPalletDecoder implements IParachainRewardEventPalletDecoder {
  decode(event: Event) {
    const rewarded = events.parachainStaking.rewarded;
    if (rewarded.v9100.is(event)) {
      const { account, rewards } = rewarded.v9100.decode(event);
      return { stash: account, amount: rewards };
    } else {
      throw new UnknownVersionError(rewarded);
    }
  }
}
