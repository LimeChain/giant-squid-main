import { IIdentitySetSubsCallPalletDecoder } from '../../../../../indexer/registry';
import { ICallPalletDecoder } from '../../../../../indexer/types';
import { Call } from '../../../../../indexer/processor';
import { UnknownVersionError } from '../../../../../utils';
import { calls } from '../../../types';

// TODO: fix return type
export class IdentitySetSubsCallPalletDecoder implements ICallPalletDecoder<IIdentitySetSubsCallPalletDecoder> {
  decode(call: Call): any {
    let identity = calls.identity.setSubs;

    if (identity.v1030.is(call)) {
      return identity.v1030.decode(call);
    } else {
      throw new UnknownVersionError(identity);
    }
  }
}
