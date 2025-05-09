import { calls } from '@/chain/polkadot/types';
import { Call, INominationPoolsSetMetadataCallPalletDecoder } from '@/indexer';
import { DataNotDecodableError, decodeHexToUTF8 } from '@/utils';

export class SetMetadataCallPalletDecoder implements INominationPoolsSetMetadataCallPalletDecoder {
  decode(call: Call) {
    const { setMetadata } = calls.nominationPools;

    if (setMetadata.v9280.is(call)) {
      const { poolId, metadata } = setMetadata.v9280.decode(call);
      return {
        id: poolId.toString(),
        metadata: decodeHexToUTF8(metadata),
      };
    }

    throw new DataNotDecodableError(setMetadata, call);
  }
}
