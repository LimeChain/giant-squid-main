import { calls } from '@/chain/kusama/types';
import { Call } from '@/indexer';
import { UnknownVersionError } from '@/utils';
import { IPayoutStakersCallPalletDecoder } from '@/indexer';

export class PayoutStakersCallPalletDecoder implements IPayoutStakersCallPalletDecoder {
  decode(event: Call) {
    let call = calls.staking.payoutStakers;

    if (call.v1058.is(event)) {
      return call.v1058.decode(event);
    } else {
      throw new UnknownVersionError(event);
    }
  }
}
