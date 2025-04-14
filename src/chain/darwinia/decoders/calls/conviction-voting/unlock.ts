import { calls } from '@/chain/darwinia/types';
import { Call, IUnlockCallPalletDecoder } from '@/indexer';
import { DataNotDecodableError, UnknownVersionError } from '@/utils';

export class UnlockCallPalletDecoder implements IUnlockCallPalletDecoder {
  decode(call: Call) {
    const { unlock } = calls.convictionVoting;
    if (unlock.v6600.is(call)) {
      const fund = unlock.v6600.decode(call);

      return {
        class: fund.class,
        target: fund.target,
      };
    }

    throw new UnknownVersionError(unlock);
  }
}
