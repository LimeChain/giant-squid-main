import { calls, v9291, v9420 } from '@/chain/polkadot/types';

import { Call, ICreatePollCallPalletDecoder } from '@/indexer';
import { DataNotDecodableError } from '@/utils';

export class CreatePoolCallPalletDecoder implements ICreatePollCallPalletDecoder {
  decode(call: Call) {
    const { create } = calls.nominationPools;

    const decodeMultiAddress = (address: v9291.MultiAddress | v9420.MultiAddress) => {
      switch (address.__kind) {
        case 'Address20':
        case 'Address32':
        case 'Id':
        case 'Raw':
          return address.value;

        default:
          throw new DataNotDecodableError(create, address);
      }
    };

    if (create.v9280.is(call)) {
      const { amount, root, nominator, stateToggler: toggler } = create.v9280.decode(call);

      return {
        amount,
        root,
        nominator,
        toggler,
      };
    } else if (create.v9291.is(call)) {
      const data = create.v9291.decode(call);
      return {
        amount: data.amount,
        root: decodeMultiAddress(data.root),
        nominator: decodeMultiAddress(data.nominator),
        toggler: decodeMultiAddress(data.stateToggler),
      };
    } else if (create.v9420.is(call)) {
      const data = create.v9420.decode(call);
      return {
        amount: data.amount,
        root: decodeMultiAddress(data.root),
        nominator: decodeMultiAddress(data.nominator),
        toggler: decodeMultiAddress(data.bouncer),
      };
    } else {
      throw new DataNotDecodableError(create, call);
    }
  }
}
