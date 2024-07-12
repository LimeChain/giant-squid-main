import { calls } from '@/chain/kusama/types';
import { Call } from '@/indexer';
import { UnknownVersionError } from '@/utils';
import { ISetControllerCallPalletDecoder } from '@/indexer';

export class SetControllerCallPalletDecoder implements ISetControllerCallPalletDecoder {
  decode(call: Call) {
    let { setController } = calls.staking;

    if (setController.v1020.is(call)) {
      const { controller } = setController.v1020.decode(call);
      if (controller.__kind === 'AccountId') {
        return controller.value.toString();
      }
      return undefined;
    }

    if (setController.v1050.is(call)) {
      const { controller } = setController.v1050.decode(call);

      return controller.toString();
    }

    if (setController.v2028.is(call)) {
      const { controller } = setController.v2028.decode(call);

      if (controller.__kind !== 'Index') {
        return controller.value.toString();
      }

      return undefined;
    }

    if (setController.v9111.is(call)) {
      const { controller } = setController.v9111.decode(call);
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
