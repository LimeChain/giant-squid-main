import { calls } from '@/chain/ternoa/types';
import { UnknownVersionError } from '@/utils';
import { Call, IPayoutStakersCallPalletDecoder } from '@/indexer';

export class PayoutStakersCallPalletDecoder implements IPayoutStakersCallPalletDecoder {
  decode(event: Call) {
    const { payoutStakers } = calls.staking;
    if (payoutStakers.v1.is(event)) {
      return payoutStakers.v1.decode(event);
    } else {
      throw new UnknownVersionError(payoutStakers);
    }
  }
}
