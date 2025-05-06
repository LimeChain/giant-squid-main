import { calls } from '@/chain/kusama/types';
import { Call, INominationPoolsNominateCallPalletDecoder } from '@/indexer';
import { DataNotDecodableError } from '@/utils';

export class NominateCallPalletDecoder implements INominationPoolsNominateCallPalletDecoder {
  decode(call: Call) {
    const { nominate } = calls.nominationPools;

    if (nominate.v9220.is(call)) {
      const { poolId, validators } = nominate.v9220.decode(call);
      return {
        poolId: poolId.toString(),
        validators,
      };
    }

    throw new DataNotDecodableError(nominate, call);
  }
}
