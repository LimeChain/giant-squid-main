import { calls } from '@/chain/kusama/types';
import { UnknownVersionError } from '@/utils';
import { Call } from '@/indexer';
import { IBondCallPalletDecoder } from '@/indexer/pallets/staking/calls/bond';

export class BondCallPalletDecoder implements IBondCallPalletDecoder {
  decode(call: Call) {
    const { bond } = calls.staking;
    if (bond.v1020.is(call)) {
      let { value, payee } = bond.v1020.decode(call);
      let payeeValue: string | undefined;

      if (payee.__kind === 'Account') {
        payeeValue = payee.value.toString();
      }
      return { amount: value, payee: { type: payee.__kind, account: payeeValue } };
    } else if (bond.v1050.is(call)) {
      let { value, payee } = bond.v1050.decode(call);
      let payeeValue: string | undefined;

      if (payee.__kind === 'Account') {
        payeeValue = payee.value.toString();
      }

      return { amount: value, payee: { type: payee.__kind, account: payeeValue } };
    } else if (bond.v2028.is(call)) {
      let { value, payee } = bond.v2028.decode(call);
      let payeeValue: string | undefined;

      if (payee.__kind === 'Account') {
        payeeValue = payee.value.toString();
      }
      return { amount: value, payee: { type: payee.__kind, account: payeeValue } };
    } else if (bond.v9111.is(call)) {
      let { value, payee } = bond.v9111.decode(call);
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