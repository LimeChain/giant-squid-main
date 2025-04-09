import { calls } from '@/chain/moonriver/types';
import { Call, IUndelegateCallPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class UndelegateCallPalletDecoder implements IUndelegateCallPalletDecoder {
  decode(call: Call) {
    const { undelegate } = calls.convictionVoting;

    if (undelegate.v2100.is(call)) {
      const fund = undelegate.v2100.decode(call);

      return {
        class: fund.class,
      };
    }

    throw new UnknownVersionError(undelegate);
  }
}
