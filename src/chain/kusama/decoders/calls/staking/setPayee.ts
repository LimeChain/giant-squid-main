import { calls } from '@/chain/kusama/types';
import { Call, ISetPayeeCallPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class SetPayeeCallPalletDecoder implements ISetPayeeCallPalletDecoder {
  decode(call: Call) {
    let { setPayee } = calls.staking;

    if (setPayee.v1020.is(call)) {
      const { payee } = setPayee.v1020.decode(call);
      let payeeValue: string | undefined;

      if (payee.__kind === 'Account') {
        payeeValue = payee.value.toString();
      }
      return { payee: { type: payee.__kind, account: payeeValue } };
    }

    throw new UnknownVersionError(setPayee);
  }
}
