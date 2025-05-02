import { calls } from '@/chain/kusama/types';
import { Call, IUndelegateCallPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class UndelegateCallPalletDecoder implements IUndelegateCallPalletDecoder {
  decode(call: Call) {
    const { undelegate } = calls.convictionVoting;

    if (undelegate.v9320.is(call)) {
      const fund = undelegate.v9320.decode(call);

      return {
        class: fund.class,
      };
    }

    throw new UnknownVersionError(undelegate);
  }
}
