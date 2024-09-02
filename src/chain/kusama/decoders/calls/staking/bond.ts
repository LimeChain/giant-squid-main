import { calls } from '@/chain/kusama/types';
import { UnknownVersionError } from '@/utils';
import { Call, IBondCallPalletDecoder } from '@/indexer';

export class BondCallPalletDecoder implements IBondCallPalletDecoder {
  decode(call: Call) {
    const { bond } = calls.staking;
    if (bond.v1020.is(call)) {
      let { value, payee, controller } = bond.v1020.decode(call);
      let payeeValue: string | undefined;
      let controllerAccount: string | undefined;

      if (controller.__kind === 'AccountId') {
        controllerAccount = controller.value.toString();
      }

      if (payee.__kind === 'Account') {
        payeeValue = payee.value.toString();
      }
      return { amount: value, controller: controllerAccount, payee: { type: payee.__kind, account: payeeValue } };
    } else if (bond.v1050.is(call)) {
      let { value, payee, controller } = bond.v1050.decode(call);
      let payeeValue: string | undefined;

      if (payee.__kind === 'Account') {
        payeeValue = payee.value.toString();
      }

      return { amount: value, controller, payee: { type: payee.__kind, account: payeeValue } };
    } else if (bond.v2028.is(call)) {
      let { value, payee, controller } = bond.v2028.decode(call);
      let payeeValue: string | undefined;
      let controllerAccount: string | undefined;

      if (controller.__kind !== 'Index') {
        controllerAccount = controller.value.toString();
      }
      if (payee.__kind === 'Account') {
        payeeValue = payee.value.toString();
      }
      return { amount: value, controller: controllerAccount, payee: { type: payee.__kind, account: payeeValue } };
    } else if (bond.v9111.is(call)) {
      let { value, payee, controller } = bond.v9111.decode(call);
      let payeeValue: string | undefined;
      let controllerAccount: string | undefined;

      if (controller.__kind !== 'Index') {
        controllerAccount = controller.value.toString();
      }

      if (payee.__kind === 'Account') {
        payeeValue = payee.value.toString();
      }

      return { amount: value, controller: controllerAccount, payee: { type: payee.__kind, account: payeeValue } };
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
