import { calls } from '@/chain/kusama/types';
import { UnknownVersionError } from '@/utils';
import { Call } from '@/indexer';
import { IBondCallPalletDecoder } from '@/indexer/pallets/staking/calls/bond';

export class BondCallPalletDecoder implements IBondCallPalletDecoder {
  decode(call: Call) {
    const { bond } = calls.staking;
    if (bond.v1020.is(call)) {
      const { value, controller } = bond.v1020.decode(call);
      return { amount: value, controller: controller.toString() };
    } else if (bond.v1050.is(call)) {
      const { value, controller } = bond.v1050.decode(call);
      return { amount: value, controller };
    } else if (bond.v2028.is(call)) {
      const { value, controller } = bond.v2028.decode(call);
      return { amount: value, controller: controller.toString() };
    } else if (bond.v9111.is(call)) {
      const { value, controller } = bond.v9111.decode(call);
      return { amount: value, controller: controller.toString() };
    } else if (bond.v9430.is(call)) {
      const { value } = bond.v9430.decode(call);
      return { amount: value };
    }

    throw new UnknownVersionError(bond);
  }
}
