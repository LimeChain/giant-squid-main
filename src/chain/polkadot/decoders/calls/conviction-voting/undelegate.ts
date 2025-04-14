import { calls } from '@/chain/polkadot/types';
import { Call, IUndelegateCallPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class UndelegateCallPalletDecoder implements IUndelegateCallPalletDecoder {
  decode(call: Call) {
    const { undelegate } = calls.convictionVoting;

    if (undelegate.v9420.is(call)) {
      const fund = undelegate.v9420.decode(call);

      return {
        class: fund.class,
      };
    }

    throw new UnknownVersionError(undelegate);
  }
}
