import { calls } from '@/chain/kusama/types';
import { Call } from '@/indexer';
import { UnknownVersionError } from '@/utils';
import { ISetSubsCallPalletDecoder } from '@/indexer';

export class SetSubsCallPalletDecoder implements ISetSubsCallPalletDecoder {
  decode(call: Call) {
    let identity = calls.identity.setSubs;

    if (identity.v1030.is(call)) {
      return identity.v1030.decode(call);
    } else {
      throw new UnknownVersionError(identity);
    }
  }
}
