import { IIdentitySetSubsCallPalletDecoder } from '../../../../../indexer/registry';
import { ICallPalletDecoder } from '../../../../../indexer/types';
import { Call } from '../../../../../indexer/processor';
import { UnknownVersionError } from '../../../../../utils';
import { calls } from '../../../types';

// TODO: fix return type
export class IdentitySetSubsCallPalletDecoder implements ICallPalletDecoder<IIdentitySetSubsCallPalletDecoder> {
  decode(call: Call): any {
    const { setSubs } = calls.identity;
    if (setSubs.v5.is(call)) {
      return setSubs.v5.decode(call);
    } else {
      throw new UnknownVersionError(setSubs);
    }
  }
}
