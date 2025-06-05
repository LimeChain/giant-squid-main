import { events } from '@/chain/centrifuge/types';
import { Event, ITransferredAssetsEventPalletDecoder } from '@/indexer';
import assert from 'assert';
import { UnknownVersionError } from '@/utils';

import { getTransferTarget } from '@/indexer/pallets/x-tokens/events/transferredMultiAssets';
import { getDestination } from '@/indexer/pallets/x-tokens/events/transferredMultiAssets';
import { getAssetAmounts } from '@/indexer/pallets/x-tokens/events/transferredMultiAssets';
import { getRawAssetLocations } from '@/indexer/pallets/x-tokens/events/transferredMultiAssets';

export class TransferredMultiAssetsEventPalletDecoder implements ITransferredAssetsEventPalletDecoder {
  decode(event: Event) {
    assert(event.call);
    const transferredMultiAssets = events.ormlXTokens.transferredMultiAssets;

    if (transferredMultiAssets.v1024.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v1024.decode(event);
      const to = getTransferTarget(dest);

      return {
        from: sender,
        to,
        toChain: getDestination(dest, to.value),
        amount: getAssetAmounts(assets),
        assets: getRawAssetLocations(assets),
      };
    }

    throw new UnknownVersionError(transferredMultiAssets);
  }
}
