import { calls } from '@/chain/kusama/types';
import { UnknownVersionError } from '@/utils';
import { Call } from '@/indexer';
import { IRebondCallPalletDecoder } from '@/indexer';

export class RebondCallPalletDecoder implements IRebondCallPalletDecoder {
  decode(call: Call) {
    const { rebond } = calls.staking;
    if (rebond.v1038.is(call)) {
      const { value } = rebond.v1038.decode(call);
      return { amount: value };
    } else {
      throw new UnknownVersionError(rebond);
    }
  }
}
