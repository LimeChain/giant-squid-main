import { calls } from '@/chain/moonbeam/types';
import { Call, IUndelegateCallPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class UndelegateCallPalletDecoder implements IUndelegateCallPalletDecoder {
  decode(call: Call) {
    const { undelegate } = calls.convictionVoting;

    if (undelegate.v2403.is(call)) {
      const fund = undelegate.v2403.decode(call);

      return {
        class: fund.class,
      };
    }

    throw new UnknownVersionError(undelegate);
  }
}
