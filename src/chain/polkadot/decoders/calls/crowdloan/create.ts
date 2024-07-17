import { calls } from '@/chain/polkadot/types';
import { Call, ICreateCallPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class CreateCallPalletDecoder implements ICreateCallPalletDecoder {
  decode(call: Call) {
    const { create } = calls.crowdloan;

    if (create.v9110.is(call)) {
      return create.v9110.decode(call);
    }

    throw new UnknownVersionError(create);
  }
}
