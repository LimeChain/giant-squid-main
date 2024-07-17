import { calls } from '@/chain/polkadot/types';
import { Call } from '@/indexer';
import { UnknownVersionError } from '@/utils';
import { ISetControllerCallPalletDecoder } from '@/indexer';

export class SetControllerCallPalletDecoder implements ISetControllerCallPalletDecoder {
  decode(call: Call) {
    let { setController } = calls.staking;

    if (setController.v0.is(call)) {
      const { controller } = setController.v0.decode(call);
      return controller;
    }

    if (setController.v28.is(call)) {
      const { controller } = setController.v28.decode(call);

      if (controller.__kind !== 'Index') {
        return controller.value.toString();
      }

      return undefined;
    }

    if (setController.v9110.is(call)) {
      const { controller } = setController.v9110.decode(call);

      if (controller.__kind !== 'Index') {
        return controller.value.toString();
      }

      return undefined;
    }

    if (setController.v9430.is(call)) {
      return undefined;
    }

    throw new UnknownVersionError(call);
  }
}
