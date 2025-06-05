import { events } from '@/chain/centrifuge/types';
import { Event, ITransferredAssetsEventPalletDecoder } from '@/indexer';
import assert from 'assert';
import { UnknownVersionError } from '@/utils';
import { getDestinationV4, getTransferTargetV4, getAssetAmountsV4, getRawAssetLocationsV4 } from '@/indexer/pallets/x-tokens/events/transferredMultiAssets';

export class TransferredAssetsEventPalletDecoder implements ITransferredAssetsEventPalletDecoder {
  decode(event: Event) {
    assert(event.call);
    const transferredAssets = events.ormlXTokens.transferredAssets;

    if (transferredAssets.v1103.is(event)) {
      const { assets, dest, fee, sender } = transferredAssets.v1103.decode(event);
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
