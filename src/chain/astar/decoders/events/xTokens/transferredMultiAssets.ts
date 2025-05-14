import { events } from '@/chain/astar/types';
import { Event, ITransferredAssetsEventPalletDecoder } from '@/indexer';
import assert from 'assert';
import { UnknownVersionError } from '@/utils';

import { V3MultiAsset, V3MultiLocation, V3Junction_Parachain } from '@/chain/astar/types/v70';

export class TransferredMultiAssetsEventPalletDecoder implements ITransferredAssetsEventPalletDecoder {
  decode(event: Event) {
    assert(event.call);
    const transferredMultiAssets = events.xTokens.transferredMultiAssets;

    if (transferredMultiAssets.v70.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v70.decode(event);
      return {
        from: sender,
        to: getToV3(dest),
        toChain: getDestination(dest),
        amount: getAssetAmounts(assets),
        assets: getAssetIdsV3(assets),
      };
    }

    throw new UnknownVersionError(transferredMultiAssets);
  }
}

function getDestination(destination: V3MultiLocation) {
  if (destination.interior.__kind === 'X1') {
    return 'Here';
  }

  if (destination.interior.__kind === 'X2' || destination.interior.__kind === 'X3') {
    const target = destination.interior.value.find((e) => e.__kind === 'Parachain') as V3Junction_Parachain;
    return target?.value?.toString();
  }

  return;
}

function getToV3(destination: V3MultiLocation) {
  if (destination.interior.__kind === 'X1') {
    const target = destination.interior.value;
    switch (target?.__kind) {
      case 'AccountId32':
        return target.id;
      case 'AccountKey20':
        return target.key;
    }
  }

  if (destination.interior.__kind === 'X2' || destination.interior.__kind === 'X3') {
    const target = destination.interior.value.find((e) => e.__kind === 'AccountId32' || e.__kind === 'AccountKey20');
    switch (target?.__kind) {
      case 'AccountId32':
        return target.id;
      case 'AccountKey20':
        return target.key;
    }
  }

  return;
}

function getAssetAmounts(assets: V3MultiAsset[]) {
  return assets.map((asset) => (asset.fun.__kind === 'Fungible' ? asset.fun.value.toString() : undefined));
}

const DEFAULT_ASSET_ID = '0x0000';
function getAssetIdsV3(assets: V3MultiAsset[]) {
  return assets.map((asset) => {
    switch (asset.id.__kind) {
      case 'Concrete':
        switch (asset.id.value.interior.__kind) {
          case 'Here':
            return [asset.id.value.interior.__kind, DEFAULT_ASSET_ID];
          case 'X1':
            return asset.id.value.interior.value.__kind === 'Parachain'
              ? [asset.id.value.interior.value.value.toString(), DEFAULT_ASSET_ID]
              : [undefined, undefined];
          case 'X2': {
            const assetChainId = asset.id.value.interior.value[0].__kind === 'Parachain' ? asset.id.value.interior.value[0].value.toString() : undefined;
            let assetId = DEFAULT_ASSET_ID;

            switch (asset.id.value.interior.value[1].__kind) {
              case 'GeneralKey':
                assetId = asset.id.value.interior.value[1].data;
                break;
            }

            return [assetChainId, assetId];
          }

          case 'X3':
          case 'X4':
          case 'X5': {
            const assetChainId = asset.id.value.interior.value[0].__kind === 'Parachain' ? asset.id.value.interior.value[0].value.toString() : undefined;
            let assetId = DEFAULT_ASSET_ID;

            switch (asset.id.value.interior.value[2].__kind) {
              case 'GeneralIndex':
                assetId = asset.id.value.interior.value[2].value.toString();
                break;
            }
            return [assetChainId, assetId];
          }
          default:
            throw new UnknownVersionError(asset.id.value.interior.__kind);
        }
      default:
        throw new UnknownVersionError(asset.id.__kind);
    }
  });
}
