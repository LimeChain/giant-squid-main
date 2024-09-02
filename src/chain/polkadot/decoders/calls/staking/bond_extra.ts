import { calls } from '@/chain/polkadot/types';
import { UnknownVersionError } from '@/utils';
import { Call, IBondExtraCallPalletDecoder } from '@/indexer';

export class BondExtraCallPalletDecoder implements IBondExtraCallPalletDecoder {
  decode(call: Call) {
    const { bondExtra } = calls.staking;

    if (bondExtra.v0.is(call)) {
      const { maxAdditional } = bondExtra.v0.decode(call);

      return { amount: maxAdditional };
    }

    throw new UnknownVersionError(bondExtra);
  }
}
