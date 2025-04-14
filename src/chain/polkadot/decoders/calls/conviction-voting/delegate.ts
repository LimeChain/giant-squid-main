import { calls } from '@/chain/polkadot/types';
import { Call, IDelegateCallPalletDecoder } from '@/indexer';
import { DataNotDecodableError, UnknownVersionError } from '@/utils';

export class DelegateCallPalletDecoder implements IDelegateCallPalletDecoder {
  decode(call: Call) {
    const { delegate } = calls.convictionVoting;

    if (delegate.v9420.is(call)) {
      const fund = delegate.v9420.decode(call);

      let to;

      switch (fund.to.__kind) {
        case 'Id':
        case 'Address20':
        case 'Address32':
        case 'Raw':
          to = fund.to.value;
          break;
        case 'Index':
          break;

        default:
          throw new DataNotDecodableError(to, fund.to);
      }

      return {
        class: fund.class,
        to,
        conviction: fund.conviction.__kind,
        balance: fund.balance,
      };
    }

    throw new UnknownVersionError(delegate);
  }
}
