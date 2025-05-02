import { calls } from '@/chain/moonriver/types';
import { Call, IUnlockCallPalletDecoder } from '@/indexer';
import { DataNotDecodableError, UnknownVersionError } from '@/utils';

export class UnlockCallPalletDecoder implements IUnlockCallPalletDecoder {
  decode(call: Call) {
    const { unlock } = calls.convictionVoting;
    if (unlock.v2100.is(call)) {
      const fund = unlock.v2100.decode(call);

      return {
        class: fund.class,
        target: fund.target,
      };
    }

    throw new UnknownVersionError(unlock);
  }
}
