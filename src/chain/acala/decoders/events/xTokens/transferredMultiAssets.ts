import { events } from '@/chain/acala/types';
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
    const transferredMultiAssets = events.xTokens.transferredMultiAssets;

    if (transferredMultiAssets.v2032.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v2032.decode(event);
      const to = getTransferTarget(dest);

      return {
        from: sender,
        to,
        toChain: getDestination(dest, to.value),
        amount: getAssetAmounts(assets),
        assets: getRawAssetLocations(assets),
      };
    } else if (transferredMultiAssets.v2040.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v2040.decode(event);
      const to = getTransferTarget(dest);

      return {
        from: sender,
        to,
        toChain: getDestination(dest, to.value),
        amount: getAssetAmounts(assets),
        assets: getRawAssetLocations(assets),
      };
    } else if (transferredMultiAssets.v2180.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v2180.decode(event);
      const to = getTransferTarget(dest);

      return {
        from: sender,
        to,
        toChain: getDestination(dest, to.value),
        amount: getAssetAmounts(assets),
        assets: getRawAssetLocations(assets),
      };
    } else if (transferredMultiAssets.v2240.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v2240.decode(event);
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
