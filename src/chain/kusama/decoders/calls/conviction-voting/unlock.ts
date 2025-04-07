import { calls } from '@/chain/kusama/types';
import { Call, IUnlockCallPalletDecoder } from '@/indexer';
import { DataNotDecodableError, UnknownVersionError } from '@/utils';

export class UnlockCallPalletDecoder implements IUnlockCallPalletDecoder {
  decode(call: Call) {
    const { unlock } = calls.convictionVoting;
    if (unlock.v9320.is(call)) {
      const fund = unlock.v9320.decode(call);
      let target;

      switch (fund.target.__kind) {
        case 'Id':
        case 'Address20':
        case 'Address32':
        case 'Raw':
          target = fund.target.value;
          break;
        case 'Index':
          target = undefined;
          break;
        default:
          throw new DataNotDecodableError(unlock, fund.target);
      }
      return {
        class: fund.class,
        target,
      };
    }

    throw new UnknownVersionError(unlock);
  }
}
