import { calls } from '@/chain/kusama/types';
import { UnknownVersionError } from '@/utils';
import { Call } from '@/indexer';
import { IUnbondCallPalletDecoder } from '@/indexer';

export class UnbondCallPalletDecoder implements IUnbondCallPalletDecoder {
  decode(call: Call) {
    const { unbond } = calls.staking;

    if (unbond.v1020.is(call)) {
      const { value } = unbond.v1020.decode(call);
      return { amount: value };
    } else {
      throw new UnknownVersionError(unbond);
    }
  }
}
