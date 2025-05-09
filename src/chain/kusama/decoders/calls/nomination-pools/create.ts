import { calls, v9291, v9420 } from '@/chain/kusama/types';

import { Call, INominationPoolsCreatePollCallPalletDecoder } from '@/indexer';
import { DataNotDecodableError } from '@/utils';

const decodeMultiAddress = (address: v9291.MultiAddress | v9420.MultiAddress) => {
  switch (address.__kind) {
    case 'Address20':
    case 'Address32':
    case 'Id':
    case 'Raw':
      return address.value;

    default:
      throw new Error(`Unknown address type: ${address.__kind}`);
  }
};
export class CreatePoolCallPalletDecoder implements INominationPoolsCreatePollCallPalletDecoder {
  decode(call: Call) {
    const { create } = calls.nominationPools;

    if (create.v9220.is(call)) {
      const { amount, root, nominator, stateToggler: toggler } = create.v9220.decode(call);

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
