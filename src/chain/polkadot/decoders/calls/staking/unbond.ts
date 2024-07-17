import { calls } from '@/chain/polkadot/types';
import { UnknownVersionError } from '@/utils';
import { Call, IUnbondCallPalletDecoder } from '@/indexer';

export class UnbondCallPalletDecoder implements IUnbondCallPalletDecoder {
  decode(call: Call) {
    const { unbond } = calls.staking;

    if (unbond.v0.is(call)) {
      const { value } = unbond.v0.decode(call);
      return { amount: value };
    } else {
      throw new UnknownVersionError(unbond);
    }
  }
}
