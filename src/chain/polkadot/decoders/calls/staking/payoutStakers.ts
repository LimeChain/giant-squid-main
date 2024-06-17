import { Call } from '@subsquid/substrate-processor';
import { UnknownVersionError } from '../../../../../utils';
import { calls } from '../../../types';
import { IStakingPayoutStakersCallPalletDecoder } from '../../../../../indexer/registry';

export class PayoutStakersCallPalletDecoder implements IStakingPayoutStakersCallPalletDecoder {
  decode(event: Call) {
    const { payoutStakers } = calls.staking;
    if (payoutStakers.v0.is(event)) {
      return payoutStakers.v0.decode(event);
    } else {
      throw new UnknownVersionError(payoutStakers);
    }
  }
}
