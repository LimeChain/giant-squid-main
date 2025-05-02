import { calls } from '@/chain/polkadot/types';
import { Call, INominationPoolsNominateCallPalletDecoder } from '@/indexer';
import { DataNotDecodableError } from '@/utils';

export class NominateCallPalletDecoder implements INominationPoolsNominateCallPalletDecoder {
  decode(call: Call) {
    const { nominate } = calls.nominationPools;

    if (nominate.v9280.is(call)) {
      const { poolId, validators } = nominate.v9280.decode(call);
      return {
        poolId: poolId.toString(),
        validators,
      };
    }

    throw new DataNotDecodableError(nominate, call);
  }
}
