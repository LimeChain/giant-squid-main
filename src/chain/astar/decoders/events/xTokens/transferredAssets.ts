import { events } from '@/chain/astar/types';
import { Event, ITransferredAssetsEventPalletDecoder } from '@/indexer';
import assert from 'assert';
import { UnknownVersionError } from '@/utils';
import { getDestinationV4, getTransferTargetV4, getAssetAmountsV4, getRawAssetLocationsV4 } from '@/indexer/pallets/x-tokens/events/transferredMultiAssets';

export class TransferredAssetsEventPalletDecoder implements ITransferredAssetsEventPalletDecoder {
  decode(event: Event) {
    assert(event.call);
    const transferredAssets = events.xTokens.transferredAssets;

    if (transferredAssets.v91.is(event)) {
      const { assets, dest, sender } = transferredAssets.v91.decode(event);

      const to = getTransferTargetV4(dest);

      return {
        from: sender,
        to,
        toChain: getDestinationV4(dest, to.value),
        amount: getAssetAmountsV4(assets),
        assets: getRawAssetLocationsV4(assets),
      };
    }
    if (transferredAssets.v1501.is(event)) {
      const { assets, dest, sender } = transferredAssets.v1501.decode(event);

      const to = getTransferTargetV4(dest);

      return {
        from: sender,
        to,
        toChain: getDestinationV4(dest, to.value),
        amount: getAssetAmountsV4(assets),
        assets: getRawAssetLocationsV4(assets),
      };
    }

    throw new UnknownVersionError(transferredAssets);
  }
}
