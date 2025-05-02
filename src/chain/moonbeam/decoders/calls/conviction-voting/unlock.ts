import { calls } from '@/chain/moonbeam/types';
import { Call, IUnlockCallPalletDecoder } from '@/indexer';
import { DataNotDecodableError, UnknownVersionError } from '@/utils';

export class UnlockCallPalletDecoder implements IUnlockCallPalletDecoder {
  decode(call: Call) {
    const { unlock } = calls.convictionVoting;
    if (unlock.v2403.is(call)) {
      const fund = unlock.v2403.decode(call);

      return {
        class: fund.class,
        target: fund.target,
      };
    }

    throw new UnknownVersionError(unlock);
  }
}
