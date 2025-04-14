import { calls } from '@/chain/basilisk/types';
import { Call, IUnlockCallPalletDecoder } from '@/indexer';
import { DataNotDecodableError, UnknownVersionError } from '@/utils';

export class UnlockCallPalletDecoder implements IUnlockCallPalletDecoder {
  decode(call: Call) {
    const { unlock } = calls.convictionVoting;
    if (unlock.v117.is(call)) {
      const fund = unlock.v117.decode(call);

      return {
        class: fund.class,
        target: fund.target,
      };
    }

    throw new UnknownVersionError(unlock);
  }
}
