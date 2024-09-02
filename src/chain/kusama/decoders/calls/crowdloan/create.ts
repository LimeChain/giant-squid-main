import { calls } from '@/chain/kusama/types';
import { Call, ICreateCallPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class CreateCallPalletDecoder implements ICreateCallPalletDecoder {
  decode(call: Call) {
    const { create } = calls.crowdloan;

    if (create.v9010.is(call)) {
      const fund = create.v9010.decode(call);

      return {
        paraId: fund.index,
        ...fund,
      };
    }

    throw new UnknownVersionError(create);
  }
}
