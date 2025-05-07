import { events } from '@/chain/bifrost-polkadot/types';
import { Event, ITransferredAssetsEventPalletDecoder } from '@/indexer';
import assert from 'assert';
import { UnknownVersionError } from '@/utils';
import { V4Asset, V4Location } from '@/chain/bifrost-polkadot/types/v11000';

export class TransferredAssetsEventPalletDecoder implements ITransferredAssetsEventPalletDecoder {
  decode(event: Event) {
    assert(event.call);
    const transferredAssets = events.xTokens.transferredAssets;

    if (transferredAssets.v11000.is(event)) {
      const { assets, dest, fee, sender } = transferredAssets.v11000.decode(event);

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
  if (destination.interior.__kind === 'X1') {
    return 'Here';
  }

  if (destination.interior.__kind === 'X2') {
    return destination.interior.value[0].__kind === 'Parachain' ? destination.interior.value[0].value.toString() : undefined;
  }

  return;
}

function getTo(destination: V4Location) {
  if (destination.interior.__kind === 'X1') {
    const target = destination.interior.value.at(-1);
    switch (target?.__kind) {
      case 'AccountId32':
        return target.id;
      case 'AccountKey20':
        return target.key;
    }
  }

  if (destination.interior.__kind === 'X2') {
    const target = destination.interior.value.at(-1);
    switch (target?.__kind) {
      case 'AccountId32':
        return target.id;
      case 'AccountKey20':
        return target.key;
    }
  }

  return;
}

function getAssetAmounts(assets: V4Asset[]) {
  return assets.map((asset) => (asset.fun.__kind === 'Fungible' ? asset.fun.value.toString() : undefined));
}

function getAssetIds(assets: V4Asset[]) {
  return assets.map((asset) => {
    switch (asset.id.interior.__kind) {
      case 'Here':
        return asset.id.interior.__kind;
      case 'X1':
      case 'X2': {
        const target = asset.id.interior.value.at(0);
        switch (target?.__kind) {
          case 'Parachain':
            return target.value.toString();
          case 'GeneralKey':
            return target.data;
        }

        return;
      }
      case 'X3': {
        const target = asset.id.interior.value.at(-1);
        return target?.__kind === 'GeneralIndex' ? target.value.toString() : undefined;
      }
    }

    return;
  });
}
