import { calls } from '@/chain/polkadot/types';
import { Call } from '@/indexer';
import { UnknownVersionError } from '@/utils';
import { ISetSubsCallPalletDecoder } from '@/indexer';

export class SetSubsCallPalletDecoder implements ISetSubsCallPalletDecoder {
  decode(call: Call) {
    const { setSubs } = calls.identity;
    if (setSubs.v5.is(call)) {
      return setSubs.v5.decode(call);
    } else {
      throw new UnknownVersionError(setSubs);
    }
  }
}
