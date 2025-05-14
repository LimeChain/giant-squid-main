import { events } from '@/chain/basilisk/types';
import { Event, ITransferredAssetsEventPalletDecoder } from '@/indexer';
import assert from 'assert';
import { UnknownVersionError } from '@/utils';

import { V1MultiAsset, V1MultiLocation } from '@/chain/basilisk/types/v38';
import { V3MultiAsset, V3MultiLocation, V3Junction_Parachain } from '@/chain/basilisk/types/v101';

export class TransferredMultiAssetsEventPalletDecoder implements ITransferredAssetsEventPalletDecoder {
  decode(event: Event) {
    assert(event.call);
    const transferredMultiAssets = events.xTokens.transferredMultiAssets;

    if (transferredMultiAssets.v38.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v38.decode(event);
      return {
        from: sender,
        to: getToV3(dest, event.call),
        toChain: getDestination(dest),
        amount: getAssetAmounts(assets),
        assets: getAssetIds(assets),
      };
    } else if (transferredMultiAssets.v43.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v43.decode(event);
      return {
        from: sender,
        to: getToV3(dest, event.call),
        toChain: getDestination(dest),
        amount: getAssetAmounts(assets),
        assets: getAssetIds(assets),
      };
    } else if (transferredMultiAssets.v101.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v101.decode(event);
      return {
        from: sender,
        to: getToV3(dest, event.call),
        toChain: getDestination(dest),
        amount: getAssetAmounts(assets),
        assets: getAssetIdsV3(assets),
      };
    }

    throw new UnknownVersionError(transferredMultiAssets);
  }
}

function getDestination(destination: V1MultiLocation | V3MultiLocation) {
  if (destination.interior.__kind === 'Here') {
    return 'Here';
  }

  if (destination.interior.__kind === 'X1') {
    switch (destination.interior.value.__kind) {
      case 'Parachain':
        return destination.interior.value.value.toString();
      case 'AccountId32':
        return 'Here';
    }

    return;
  }

  if (destination.interior.__kind === 'X2' || destination.interior.__kind === 'X3') {
    const target = destination.interior.value.find((e) => e.__kind === 'Parachain') as V3Junction_Parachain;
    return target?.value?.toString();
  }

  return;
}

function getToV3(destination: V1MultiLocation | V3MultiLocation, call: any) {
  // return the target from the call args
  if (destination.interior.__kind === 'Here') {
    const call_dest = call?.args?.dest?.value?.interior?.__kind;
    switch (call_dest) {
      case 'X1':
        return call?.args?.dest?.value?.interior?.value?.id;
      default:
        const dest = call?.args?.dest?.value?.interior?.value?.find((v: any) => v.__kind === 'AccountId32' || v.__kind === 'AccountKey20');
        switch (dest.__kind) {
          case 'AccountId32':
            return dest.id;
          case 'AccountKey20':
            return dest.key;
        }

        return;
    }
  }

  if (destination.interior.__kind === 'X1') {
    const target = destination.interior.value;
    switch (target?.__kind) {
      case 'AccountId32':
        return target.id;
      case 'AccountKey20':
        return target.key;

      default:
        const call_dest = call?.args?.dest?.value?.interior?.__kind;
        switch (call_dest) {
          case 'X1':
            return call?.args?.dest?.value?.interior?.value?.id;
          default:
            const dest = call?.args?.dest?.value?.interior?.value?.find((v: any) => v.__kind === 'AccountId32' || v.__kind === 'AccountKey20');
            switch (dest?.__kind) {
              case 'AccountId32':
                return dest.id;
              case 'AccountKey20':
                return dest.key;
            }

            return;
        }
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

function getAssetAmounts(assets: (V1MultiAsset | V3MultiAsset)[]) {
  return assets.map((asset) => (asset.fun.__kind === 'Fungible' ? asset.fun.value.toString() : undefined));
}

const DEFAULT_ASSET_ID = '0x0000';
function getAssetIds(assets: V1MultiAsset[]) {
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
