import { calls } from '@/chain/moonriver/types';
import { Call, IDelegateCallPalletDecoder } from '@/indexer';
import { DataNotDecodableError, UnknownVersionError } from '@/utils';

export class DelegateCallPalletDecoder implements IDelegateCallPalletDecoder {
  decode(call: Call) {
    const { delegate } = calls.convictionVoting;

    if (delegate.v2100.is(call)) {
      const fund = delegate.v2100.decode(call);

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
