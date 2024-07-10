import { calls } from '@/chain/kusama/types';
import { UnknownVersionError } from '@/utils';
import { Call } from '@/indexer';
import { IBondExtraCallPalletDecoder } from '@/indexer';

export class BondExtraCallPalletDecoder implements IBondExtraCallPalletDecoder {
  decode(call: Call) {
    const { bondExtra } = calls.staking;

    if (bondExtra.v1020.is(call)) {
      const { maxAdditional } = bondExtra.v1020.decode(call);

      return { amount: maxAdditional };
    }

    throw new UnknownVersionError(bondExtra);
  }
}
