import { events } from '@/chain/bifrost-polkadot/types';
import { Event, ITransferredAssetsEventPalletDecoder } from '@/indexer';
import assert from 'assert';
import { UnknownVersionError } from '@/utils';

import { V1Junction_Parachain, V1MultiAsset, V1MultiLocation } from '@/chain/bifrost-polkadot/types/v952';
import { V1MultiAsset as V1MultiAssetV2040, V1MultiLocation as V1MultiLocationV2040 } from '@/chain/bifrost-polkadot/types/v970';
import { V3MultiAsset, V3MultiLocation } from '@/chain/bifrost-polkadot/types/v972';
import { V3MultiAsset as V3MultiAssetV2240, V3MultiLocation as V3MultiLocationV2240 } from '@/chain/bifrost-polkadot/types/v10000';

export class TransferredMultiAssetsEventPalletDecoder implements ITransferredAssetsEventPalletDecoder {
  decode(event: Event) {
    assert(event.call);
    const transferredMultiAssets = events.xTokens.transferredMultiAssets;

    if (transferredMultiAssets.v952.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v952.decode(event);
      return {
        from: sender,
        to: getTo(dest),
        toChain: getDestination(dest),
        amount: getAssetAmounts(assets),
        assets: getAssetIds(assets),
      };
    } else if (transferredMultiAssets.v970.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v970.decode(event);
      return {
        from: sender,
        to: getTo(dest),
        toChain: getDestination(dest),
        amount: getAssetAmounts(assets),
        assets: getAssetIds(assets),
      };
    } else if (transferredMultiAssets.v972.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v972.decode(event);
      return {
        from: sender,
        to: getToV3(dest),
        toChain: getDestination(dest),
        amount: getAssetAmounts(assets),
        assets: getAssetIdsV3(assets),
      };
    } else if (transferredMultiAssets.v10000.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v10000.decode(event);
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

function getDestination(destination: V1MultiLocation | V1MultiLocationV2040 | V3MultiLocation | V3MultiLocationV2240) {
  if (destination.interior.__kind === 'X1') {
    return 'Here';
  }

  if (destination.interior.__kind === 'X2' || destination.interior.__kind === 'X3') {
    const target = destination.interior.value.find((e) => e.__kind === 'Parachain') as V1Junction_Parachain;

    return target?.value?.toString();
  }

  return;
}

function getTo(destination: V1MultiLocation | V1MultiLocationV2040) {
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
    const target = destination.interior.value.find((e) => e.__kind === 'AccountId32' || e.__kind === 'AccountKey20' || e.__kind === 'GeneralKey');
    switch (target?.__kind) {
      case 'AccountId32':
        return target.id;
      case 'AccountKey20':
        return target.key;
      case 'GeneralKey':
        return target.value;
    }
  }

  return;
}

function getToV3(destination: V3MultiLocation | V3MultiLocationV2240) {
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

function getAssetAmounts(assets: (V1MultiAsset | V3MultiAsset | V3MultiAssetV2240 | V1MultiAssetV2040)[]) {
  return assets.map((asset) => (asset.fun.__kind === 'Fungible' ? asset.fun.value.toString() : undefined));
}

const DEFAULT_ASSET_ID = '0x0000';
function getAssetIds(assets: V1MultiAssetV2040[]) {
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
                assetId = asset.id.value.interior.value[1].value;
                break;
            }

            return [assetChainId, assetId];
          }

          case 'X3': {
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

function getAssetIdsV3(assets: V3MultiAssetV2240[]) {
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

          case 'X3': {
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
