// @ts-nocheck
import { calls } from '@/chain/<name>/types';
import { Call, IPayoutStakersCallPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

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
