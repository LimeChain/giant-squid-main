import { calls } from '@/chain/polkadot/types';
import { UnknownVersionError } from '@/utils';
import { Call, IBondCallPalletDecoder } from '@/indexer';

export class BondCallPalletDecoder implements IBondCallPalletDecoder {
  decode(call: Call) {
    const { bond } = calls.staking;
    if (bond.v0.is(call)) {
      let { value, payee } = bond.v0.decode(call);
      let payeeValue: string | undefined;

      if (payee.__kind === 'Account') {
        payeeValue = payee.value.toString();
      }
      return { amount: value, payee: { type: payee.__kind, account: payeeValue } };
    } else if (bond.v28.is(call)) {
      let { value, payee } = bond.v28.decode(call);
      let payeeValue: string | undefined;

      if (payee.__kind === 'Account') {
        payeeValue = payee.value.toString();
      }
      return { amount: value, payee: { type: payee.__kind, account: payeeValue } };
    } else if (bond.v9110.is(call)) {
      let { value, payee } = bond.v9110.decode(call);
      let payeeValue: string | undefined;

      if (payee.__kind === 'Account') {
        payeeValue = payee.value.toString();
      }
      return { amount: value, payee: { type: payee.__kind, account: payeeValue } };
    } else if (bond.v9430.is(call)) {
      let { value, payee } = bond.v9430.decode(call);
      let payeeValue: string | undefined;

      if (payee.__kind === 'Account') {
        payeeValue = payee.value.toString();
      }
      return { amount: value, payee: { type: payee.__kind, account: payeeValue } };
    } else if (bond.v9430.is(call)) {
      let { value, payee } = bond.v9430.decode(call);
      let payeeValue: string | undefined;

      if (payee.__kind === 'Account') {
        payeeValue = payee.value.toString();
      }
      return { amount: value, payee: { type: payee.__kind, account: payeeValue } };
    }

    throw new UnknownVersionError(bond);
  }
}
