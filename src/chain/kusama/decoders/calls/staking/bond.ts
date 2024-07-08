import { calls } from '@/chain/kusama/types';
import { UnknownVersionError } from '@/utils';
import { Call } from '@/indexer';
import { IBondCallPalletDecoder } from '@/indexer/pallets/staking/calls/bond';

export class BondCallPalletDecoder implements IBondCallPalletDecoder {
  decode(call: Call) {
    const { bond } = calls.staking;
    if (bond.v1020.is(call)) {
      const { value, controller, payee } = bond.v1020.decode(call);
      let ctrlAddress: string | undefined;
      let payeeAddress: string | undefined;

      if (payee.__kind === 'Account') {
        payeeAddress = payee.value.toString();
      }
      if (controller.__kind === 'AccountId') {
        ctrlAddress = controller.value;
      }
      return { amount: value, controller: ctrlAddress, payee: payeeAddress };
    } else if (bond.v1050.is(call)) {
      const { value, controller, payee } = bond.v1050.decode(call);
      let payeeAddress: string | undefined;

      if (payee.__kind === 'Account') {
        payeeAddress = payee.value.toString();
      }

      return { amount: value, controller, payee: payeeAddress };
    } else if (bond.v2028.is(call)) {
      const { value, controller, payee } = bond.v2028.decode(call);
      let ctrlAddress: string | undefined;
      let payeeAddress: string | undefined;

      if (payee.__kind === 'Account') {
        payeeAddress = payee.value.toString();
      }
      if (controller.__kind === 'Address20' || controller.__kind === 'Address32' || controller.__kind === 'Raw' || controller.__kind === 'Id') {
        ctrlAddress = controller.value.toString();
      }
      return { amount: value, controller: ctrlAddress, payee: payeeAddress };
    } else if (bond.v9111.is(call)) {
      const { value, controller, payee } = bond.v9111.decode(call);
      let ctrlAddress: string | undefined;
      let payeeAddress: string | undefined;

      if (payee.__kind === 'Account') {
        payeeAddress = payee.value.toString();
      }
      if (controller.__kind === 'Address20' || controller.__kind === 'Address32' || controller.__kind === 'Raw' || controller.__kind === 'Id') {
        ctrlAddress = controller.value.toString();
      }
      return { amount: value, controller: ctrlAddress, payee: payeeAddress };
    } else if (bond.v9430.is(call)) {
      const { value, payee } = bond.v9430.decode(call);
      let payeeAddress: string | undefined;

      if (payee.__kind === 'Account') {
        payeeAddress = payee.value.toString();
      }
      return { amount: value, payee: payeeAddress };
    }

    throw new UnknownVersionError(bond);
  }
}
