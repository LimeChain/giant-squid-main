import { events } from '@/chain/karura/types';
import { Event, ITransferredAssetsEventPalletDecoder } from '@/indexer';
import assert from 'assert';
import { UnknownVersionError } from '@/utils';
import { V4Asset, V4Junction_Parachain, V4Location } from '@/chain/karura/types/v2250';

export class TransferredAssetsEventPalletDecoder implements ITransferredAssetsEventPalletDecoder {
  decode(event: Event) {
    assert(event.call);
    const transferredAssets = events.xTokens.transferredAssets;

    if (transferredAssets.v2250.is(event)) {
      const { assets, dest, fee, sender } = transferredAssets.v2250.decode(event);

      return {
        from: sender,
        toChain: getDestinationV4(dest),
        amount: getAssetAmounts(assets),
        assets: getAssetIds(assets),
        to: getTo(dest),
      };
    }

    throw new UnknownVersionError(transferredAssets);
  }
}

function getDestinationV4(destination: V4Location) {
  switch (destination.interior.__kind) {
    case 'Here':
    case 'X1':
      return 'Here';

    case 'X2':
    case 'X3':
    case 'X4':
    case 'X5':
      const target = destination.interior.value.find((e) => e.__kind === 'Parachain') as V4Junction_Parachain;

      return target?.value?.toString();
  }

  return;
}

function getTo(destination: V4Location) {
  switch (destination.interior.__kind) {
    case 'X1':
    case 'X2':
    case 'X3':
    case 'X4':
    case 'X5': {
      const target = destination.interior.value.find((e) => e.__kind === 'AccountId32' || e.__kind === 'AccountKey20' || e.__kind === 'GeneralKey');
      switch (target?.__kind) {
        case 'AccountId32':
          return target.id;
        case 'AccountKey20':
          return target.key;
        case 'GeneralKey':
          return target.data;
      }
    }
  }

  return;
}

function getAssetAmounts(assets: V4Asset[]) {
  return assets.map((asset) => (asset.fun.__kind === 'Fungible' ? asset.fun.value.toString() : undefined));
}

const DEFAULT_ASSET_ID = '0x0000';
function getAssetIds(assets: V4Asset[]) {
  return assets.map((asset) => {
    switch (asset.id.interior.__kind) {
      case 'Here':
        return [asset.id.interior.__kind, DEFAULT_ASSET_ID];
      case 'X1':
        return asset.id.interior.value[0].__kind === 'Parachain' ? [asset.id.interior.value[0].value.toString(), DEFAULT_ASSET_ID] : [undefined, undefined];
      case 'X2': {
        const assetChainId = asset.id.interior.value[0].__kind === 'Parachain' ? asset.id.interior.value[0].value.toString() : undefined;
        let assetId = DEFAULT_ASSET_ID;

        switch (asset.id.interior.value[1].__kind) {
          case 'Parachain':
            assetId = asset.id.interior.value[1].value.toString();
            break;
          case 'GeneralKey':
            assetId = asset.id.interior.value[1].data;
            break;
        }

        return [assetChainId, assetId];
      }
      case 'X3':
      case 'X4':
      case 'X5': {
        const assetChainId = asset.id.interior.value[0].__kind === 'Parachain' ? asset.id.interior.value[0].value.toString() : undefined;
        let assetId = DEFAULT_ASSET_ID;

        switch (asset.id.interior.value[2].__kind) {
          case 'GeneralIndex':
            assetId = asset.id.interior.value[2].value.toString();
            break;
        }
        return [assetChainId, assetId];
      }

      default:
        throw new UnknownVersionError(asset.id.interior.__kind);
    }
  });
}
