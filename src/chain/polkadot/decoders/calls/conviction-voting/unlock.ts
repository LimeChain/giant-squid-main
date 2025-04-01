import { calls } from '@/chain/polkadot/types';
import { Call, IUnlockCallPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class UnlockCallPalletDecoder implements IUnlockCallPalletDecoder {
  decode(call: Call) {
    const { unlock } = calls.convictionVoting;
    if (unlock.v9420.is(call)) {
      const fund = unlock.v9420.decode(call);
      let target;
      switch (fund.target.__kind) {
        case 'Id':
        case 'Address20':
        case 'Address32':
        case 'Raw':
          target = fund.target.value;
          break;
      }
      return {
        class: fund.class,
        target,
      };
    }

    throw new UnknownVersionError(unlock);
  }
}
