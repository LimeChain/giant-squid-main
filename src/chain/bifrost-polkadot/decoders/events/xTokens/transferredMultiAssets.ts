import { events } from '@/chain/bifrost-polkadot/types';
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

    if (transferredMultiAssets.v952.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v952.decode(event);
      const to = getTransferTarget(dest);
      return {
        from: sender,
        to,
        toChain: getDestination(dest, to.value),
        amount: getAssetAmounts(assets),
        assets: getRawAssetLocations(assets),
      };
    } else if (transferredMultiAssets.v970.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v970.decode(event);
      const to = getTransferTarget(dest);
      return {
        from: sender,
        to,
        toChain: getDestination(dest, to.value),
        amount: getAssetAmounts(assets),
        assets: getRawAssetLocations(assets),
      };
    } else if (transferredMultiAssets.v972.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v972.decode(event);
      const to = getTransferTarget(dest);
      return {
        from: sender,
        to,
        toChain: getDestination(dest, to.value),
        amount: getAssetAmounts(assets),
        assets: getRawAssetLocations(assets),
      };
    } else if (transferredMultiAssets.v10000.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v10000.decode(event);
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
