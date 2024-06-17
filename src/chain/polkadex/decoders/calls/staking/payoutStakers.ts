import { Call } from '@subsquid/substrate-processor';
import { UnknownVersionError } from '../../../../../utils';
import { calls } from '../../../types';
import { IStakingPayoutStakersCallPalletDecoder } from '../../../../../indexer/registry';

export class PayoutStakersCallPalletDecoder implements IStakingPayoutStakersCallPalletDecoder {
  decode(event: Call) {
    const { payoutStakers } = calls.staking;
    if (payoutStakers.v268.is(event)) {
      return payoutStakers.v268.decode(event);
    } else {
      throw new UnknownVersionError(payoutStakers);
    }
  }
}
