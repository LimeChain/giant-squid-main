import { calls } from '@/chain/polkadot/types';
import { UnknownVersionError } from '@/utils';
import { Call } from '@/indexer';
import { ISetPayeeCallPalletDecoder } from '@/indexer/pallets/staking/calls/setPayee';

export class SetPayeeCallPalletDecoder implements ISetPayeeCallPalletDecoder {
  decode(call: Call) {
    const { setPayee } = calls.staking;
    if (setPayee.v0.is(call)) {
      let { payee } = setPayee.v0.decode(call);
      let payeeValue: string | undefined;

      if (payee.__kind === 'Account') {
        payeeValue = payee.value.toString();
      }
      return { payee: { type: payee.__kind, account: payeeValue } };
    }

    throw new UnknownVersionError(setPayee);
  }
}
