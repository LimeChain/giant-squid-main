import { events } from '@/chain/shiden/types';
import { Event, ITransferredAssetsEventPalletDecoder } from '@/indexer';
import assert from 'assert';
import { UnknownVersionError } from '@/utils';
import { getDestinationV4, getTransferTargetV4, getAssetAmountsV4, getRawAssetLocationsV4 } from '@/indexer/pallets/x-tokens/events/transferredMultiAssets';

export class TransferredAssetsEventPalletDecoder implements ITransferredAssetsEventPalletDecoder {
  decode(event: Event) {
    assert(event.call);
    const transferredAssets = events.xTokens.transferredAssets;

    if (transferredAssets.v130.is(event)) {
      const { assets, dest, fee, sender } = transferredAssets.v130.decode(event);

      const to = getTransferTargetV4(dest);
      return {
        to,
        from: sender,
        toChain: getDestinationV4(dest, to.value),
        amount: getAssetAmountsV4(assets),
        assets: getRawAssetLocationsV4(assets),
      };
    } else if (transferredAssets.v1500.is(event)) {
      const { assets, dest, fee, sender } = transferredAssets.v1500.decode(event);
      const to = getTransferTargetV4(dest);
      return {
        to,
        from: sender,
        toChain: getDestinationV4(dest, to.value),
        amount: getAssetAmountsV4(assets),
        assets: getRawAssetLocationsV4(assets),
      };
    }

    throw new UnknownVersionError(transferredAssets);
  }
}
