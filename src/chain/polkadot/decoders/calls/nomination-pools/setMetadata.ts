import { calls, v9291, v9420 } from '@/chain/polkadot/types';

import { Call, ICreatePollCallPalletDecoder, ISetMetadataCallPalletDecoder } from '@/indexer';
import { DataNotDecodableError } from '@/utils';
import { Bytes } from '@subsquid/ss58';

export class SetMetadataCallPalletDecoder implements ISetMetadataCallPalletDecoder {
  decode(call: Call) {
    const { setMetadata } = calls.nominationPools;

    function decodeHexToUTF8(hexString: Bytes) {
      // Remove '0x' prefix if present
      if (hexString.startsWith('0x')) {
        hexString = hexString.slice(2);
      }

      // Convert hex to bytes and then to UTF-8 string
      const bytes = [];
      for (let i = 0; i < hexString.length; i += 2) {
        bytes.push(parseInt(hexString.substr(i, 2), 16));
      }

      return new TextDecoder('utf-8').decode(new Uint8Array(bytes));
    }

    if (setMetadata.v9280.is(call)) {
      const { poolId, metadata } = setMetadata.v9280.decode(call);

      return {
        id: poolId,
        metadata: decodeHexToUTF8(metadata),
      };
    }

    throw new DataNotDecodableError(setMetadata, call);
  }
}
