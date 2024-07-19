import { calls } from '@/chain/polkadex/types';
import { Call, IPayoutStakersCallPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class PayoutStakersCallPalletDecoder implements IPayoutStakersCallPalletDecoder {
  decode(event: Call) {
    const { payoutStakers } = calls.staking;
    if (payoutStakers.v268.is(event)) {
      return payoutStakers.v268.decode(event);
    } else {
      throw new UnknownVersionError(payoutStakers);
    }
  }
}
