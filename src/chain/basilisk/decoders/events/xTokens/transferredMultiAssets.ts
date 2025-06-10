import { events } from '@/chain/basilisk/types';
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

    if (transferredMultiAssets.v38.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v38.decode(event);
      const to = getTransferTarget(dest);
      return {
        from: sender,
        to,
        toChain: getDestination(dest, to.value),
        amount: getAssetAmounts(assets),
        assets: getRawAssetLocations(assets),
      };
    } else if (transferredMultiAssets.v43.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v43.decode(event);
      const to = getTransferTarget(dest);
      return {
        from: sender,
        to,
        toChain: getDestination(dest),
        amount: getAssetAmounts(assets),
        assets: getRawAssetLocations(assets),
      };
    } else if (transferredMultiAssets.v101.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v101.decode(event);
      const to = getTransferTarget(dest);
      return {
        from: sender,
        to,
        toChain: getDestination(dest),
        amount: getAssetAmounts(assets),
        assets: getRawAssetLocations(assets),
      };
    }

    throw new UnknownVersionError(transferredMultiAssets);
  }
}
