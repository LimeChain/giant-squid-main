import { events } from '@/chain/centrifuge/types';
import { Event, ITransferredAssetsEventPalletDecoder } from '@/indexer';
import assert from 'assert';
import { UnknownVersionError } from '@/utils';

import { getAssetAmounts, getDestination, getTransferTarget } from '@/indexer/pallets/x-tokens/events/transferredMultiAssets';
import { getRawAssetLocations } from '@/indexer/pallets/x-tokens/events/transferredMultiAssets';

export class TransferredMultiAssetsEventPalletDecoder implements ITransferredAssetsEventPalletDecoder {
  decode(event: Event) {
    assert(event.call);
    const transferredMultiAssets = events.xTokens.transferredMultiAssets;

    if (transferredMultiAssets.v1009.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v1009.decode(event);
      const to = getTransferTarget(dest);

      return {
        from: sender,
        to,
        toChain: getDestination(dest, to.value),
        amount: getAssetAmounts(assets),
        assets: getRawAssetLocations(assets),
      };
    } else if (transferredMultiAssets.v1019.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v1019.decode(event);
      const to = getTransferTarget(dest);

      return {
        from: sender,
        to,
        toChain: getDestination(dest, to.value),
        amount: getAssetAmounts(assets),
        assets: getRawAssetLocations(assets),
      };
    } else if (transferredMultiAssets.v1020.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v1020.decode(event);
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
