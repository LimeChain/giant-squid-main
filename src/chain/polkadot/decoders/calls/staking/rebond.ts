import { calls } from '@/chain/polkadot/types';
import { UnknownVersionError } from '@/utils';
import { Call } from '@/indexer';
import { IRebondCallPalletDecoder } from '@/indexer';

export class RebondCallPalletDecoder implements IRebondCallPalletDecoder {
  decode(call: Call) {
    const { rebond } = calls.staking;
    if (rebond.v0.is(call)) {
      const { value } = rebond.v0.decode(call);
      return { amount: value };
    } else {
      throw new UnknownVersionError(rebond);
    }
  }
}
