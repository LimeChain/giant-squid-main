import { calls } from '@/chain/moonbeam/types';
import { Call, IDelegateCallPalletDecoder } from '@/indexer';
import { DataNotDecodableError, UnknownVersionError } from '@/utils';

export class DelegateCallPalletDecoder implements IDelegateCallPalletDecoder {
  decode(call: Call) {
    const { delegate } = calls.convictionVoting;

    if (delegate.v2403.is(call)) {
      const fund = delegate.v2403.decode(call);

      return {
        class: fund.class,
        to: fund.to,
        conviction: fund.conviction.__kind,
        balance: fund.balance,
      };
    }

    throw new UnknownVersionError(delegate);
  }
}
