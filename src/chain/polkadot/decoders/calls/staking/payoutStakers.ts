import { calls } from '@/chain/polkadot/types';
import { UnknownVersionError } from '@/utils';
import { Call, IPayoutStakersCallPalletDecoder } from '@/indexer';

export class PayoutStakersCallPalletDecoder implements IPayoutStakersCallPalletDecoder {
  decode(event: Call) {
    const { payoutStakers } = calls.staking;
    if (payoutStakers.v0.is(event)) {
      return payoutStakers.v0.decode(event);
    } else {
      throw new UnknownVersionError(payoutStakers);
    }
  }
}
