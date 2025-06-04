import { events } from '@/chain/amplitude/types';
import { Event, ITransferredAssetsEventPalletDecoder } from '@/indexer';
import assert from 'assert';
import { UnknownVersionError } from '@/utils';

import {
  V1Junction,
  V1Junction_GeneralIndex,
  V1Junction_Parachain,
  V1Junction_PalletInstance,
  V1MultiAsset,
  V1MultiLocation,
  V1Junction_AccountId32,
  V1Junction_AccountKey20,
  V1Junction_GeneralKey,
} from '@/chain/amplitude/types/v6';
import { V1MultiAsset as V1MultiAssetV2040, V1MultiLocation as V1MultiLocationV2040, V1Junction as V1JunctionV2040 } from '@/chain/amplitude/types/v7';
import { V3Junction, V3Junction_AccountId32, V3Junction_AccountKey20, V3Junction_GeneralKey, V3MultiAsset, V3MultiLocation } from '@/chain/amplitude/types/v10';
import {
  V3Junction as V3JunctionV2240,
  V3Junction_GeneralIndex,
  V3Junction_Parachain,
  V3Junction_PalletInstance,
  V3MultiAsset as V3MultiAssetV2240,
  V3MultiLocation as V3MultiLocationV2240,
} from '@/chain/amplitude/types/v20';

export class TransferredMultiAssetsEventPalletDecoder implements ITransferredAssetsEventPalletDecoder {
  decode(event: Event) {
    assert(event.call);
    const transferredMultiAssets = events.xTokens.transferredMultiAssets;

    if (transferredMultiAssets.v6.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v6.decode(event);
      const to = getTransferTarget(dest);

      return {
        from: sender,
        to,
        toChain: getDestination(dest, to.value),
        amount: getAssetAmounts(assets),
        assets: getRawAssetLocations(assets),
      };
    } else if (transferredMultiAssets.v7.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v7.decode(event);
      const to = getTransferTarget(dest);

      return {
        from: sender,
        to,
        toChain: getDestination(dest, to.value),
        amount: getAssetAmounts(assets),
        assets: getRawAssetLocations(assets),
      };
    } else if (transferredMultiAssets.v10.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v10.decode(event);
      const to = getTransferTarget(dest);

      return {
        from: sender,
        to,
        toChain: getDestination(dest, to.value),
        amount: getAssetAmounts(assets),
        assets: getRawAssetLocations(assets),
      };
    } else if (transferredMultiAssets.v20.is(event)) {
      const { assets, dest, sender } = transferredMultiAssets.v20.decode(event);
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

function getDestination(destination: V1MultiLocation | V1MultiLocationV2040 | V3MultiLocation | V3MultiLocationV2240, currentChain?: string | null) {
  const { parents, interior } = destination;

  // Same chain destination
  if (parents === 0) {
    return currentChain; // Same chain destination
  }

  // Parent chain or cross-chain destination
  if (parents === 1) {
    switch (interior.__kind) {
      case 'Here':
        return '0'; // Relay chain (Kusama/Polkadot)

      case 'X1':
        if (interior.value.__kind === 'Parachain') {
          return interior.value.value.toString();
        }
        return '0'; // Default to the relay chain (Kusama/Polkadot)

      case 'X2':
      case 'X3':
      case 'X4':
      case 'X5':
      case 'X6':
      case 'X7':
      case 'X8':
        // Find all parachain junctions in the path
        const parachainJunctions = interior.value.filter((e) => e.__kind === 'Parachain') as V1Junction_Parachain[];

        if (parachainJunctions.length === 0) {
          return '0'; // No parachain found, default to relay chain
        }

        if (parachainJunctions.length === 1) {
          // Single hop to target parachain
          return parachainJunctions[0].value.toString();
        }

        // Multi-hop routing: return the FINAL destination parachain
        // Example: ["Parachain(2000)", "Parachain(2087)", "PalletInstance(53)"]
        // Route: currentChain -> relay -> 2000 -> 2087
        // Final destination: 2087
        return parachainJunctions[parachainJunctions.length - 1].value.toString();
    }
  }

  // Higher parent levels (have not found any examples of this)
  if (parents > 1) {
    // For now, treat as relay chain
    return '0';
  }

  return;
}

function getTransferTarget(destination: V1MultiLocation | V1MultiLocationV2040 | V3MultiLocation | V3MultiLocationV2240) {
  const { interior } = destination;

  switch (interior.__kind) {
    case 'Here':
      // Transfer to the chain itself (no specific account target)
      return { type: 'Here', value: '0' };

    case 'X1':
      return extractTargetFromJunction(interior.value);

    case 'X2':
    case 'X3':
    case 'X4':
    case 'X5':
    case 'X6':
    case 'X7':
    case 'X8':
      // Find the target account in the junction path
      // Priority: AccountId32 > AccountKey20 > GeneralKey
      const junctions = interior.value;

      // First try to find AccountId32 (most common)
      const accountId32 = junctions.find((j) => j.__kind === 'AccountId32') as V1Junction_AccountId32 | V3Junction_AccountId32;
      if (accountId32) {
        return { type: 'AccountId32', value: accountId32.id };
      }

      // Then try AccountKey20 (EVM addresses)
      const accountKey20 = junctions.find((j) => j.__kind === 'AccountKey20') as V1Junction_AccountKey20 | V3Junction_AccountKey20;
      if (accountKey20) {
        return { type: 'AccountKey20', value: accountKey20.key };
      }

      // Finally try GeneralKey (custom identifiers)
      const generalKey = junctions.find((j) => j.__kind === 'GeneralKey') as V1Junction_GeneralKey | V3Junction_GeneralKey;
      if (generalKey) {
        // Handle both V1/V2 (value) and V3+ (data) formats
        const keyValue = 'data' in generalKey ? generalKey.data : generalKey.value;
        return { type: 'GeneralKey', value: keyValue };
      }

      // No specific account target found - transfer to the chain/pallet level
      return { type: 'Here', value: '0' };

    default:
      return { type: 'Unknown', value: null };
  }
}

function extractTargetFromJunction(junction: V1Junction | V1JunctionV2040 | V3Junction | V3JunctionV2240) {
  switch (junction.__kind) {
    case 'AccountId32':
      return { type: 'AccountId32', value: junction.id };

    case 'AccountKey20':
      return { type: 'AccountKey20', value: junction.key };

    case 'GeneralKey':
      // Handle both V1/V2 (value) and V3+ (data) formats
      const keyValue = 'data' in junction ? junction.data : junction.value;
      return { type: 'GeneralKey', value: keyValue };

    case 'Parachain':
      // Transfer to a parachain (no specific account)
      return { type: 'Parachain', value: junction.value.toString() };

    case 'PalletInstance':
      // Transfer to a pallet (no specific account)
      return { type: 'PalletInstance', value: junction.value.toString() };

    default:
      return { type: 'Unknown', value: null };
  }
}

function getAssetAmounts(assets: (V1MultiAsset | V1MultiAssetV2040 | V3MultiAsset | V3MultiAssetV2240)[]) {
  return assets.map((asset) => {
    // Most common case
    if (asset.fun.__kind === 'Fungible') {
      return { type: asset.fun.__kind, value: asset.fun.value.toString() };
    }

    // Non-fungible assets are mostly not used yet, but we can handle them
    switch (asset.fun.value.__kind) {
      case 'Array32':
      case 'Array16':
      case 'Array8':
      case 'Array4':
      case 'Blob':
        return { type: asset.fun.value.__kind, value: asset.fun.value.value };
      case 'Index':
        return { type: 'Index', value: asset.fun.value.value.toString() };
      case 'Undefined':
        return { type: 'Undefined', value: null };
      default:
        return { type: 'Unknown', value: null };
    }
  });
}

function getRawAssetLocations(assets: (V1MultiAsset | V3MultiAsset | V3MultiAssetV2240 | V1MultiAssetV2040)[]) {
  return assets.map((asset) => {
    // We only support concrete assets for now (have not found any examples of abstract assets yet)
    if (asset.id.__kind !== 'Concrete') {
      return {
        parents: null,
        pallet: null,
        assetId: null,
        error: 'Non-concrete asset',
      };
    }

    const location = asset.id.value;
    const parents = location.parents;
    let pallet: string | null = null;
    let assetId: string | null = null;
    let parachain: string | null = null;

    switch (location.interior.__kind) {
      case 'Here':
        // Relay chain native: parents=1, Here
        return { parents, pallet: null, assetId: null, fullPath: ['Here'] };

      case 'X1':
        switch (location.interior.value.__kind) {
          case 'PalletInstance':
            // Same chain native: parents=0, X1(PalletInstance(10))
            pallet = location.interior.value.value.toString();
            return { parents, pallet, assetId: null, fullPath: [`PalletInstance(${pallet})`] };
          case 'Parachain':
            // Cross-chain reference: parents=1, X1(Parachain(2000))
            parachain = location.interior.value.value.toString();
            return { parents, pallet: null, assetId: null, parachain, fullPath: [`Parachain(${parachain})`] };
          case 'GeneralIndex':
            // Asset by index: parents=0, X1(GeneralIndex(5))
            assetId = location.interior.value.value.toString();
            return { parents, pallet: null, assetId, fullPath: [`GeneralIndex(${assetId})`] };
          case 'GeneralKey':
            // Asset by key: parents=0, X1(GeneralKey(...))
            const keyData = 'data' in location.interior.value ? location.interior.value.data : location.interior.value.value;
            assetId = keyData;
            return { parents, pallet: null, assetId, fullPath: [`GeneralKey(${keyData})`] };
          default:
            return { parents, pallet: null, assetId: null, error: 'Unknown X1 junction type' };
        }

      case 'X2': {
        const [first, second] = location.interior.value;

        switch (first.__kind) {
          case 'PalletInstance':
            // Same chain asset: parents=0, X2(PalletInstance(53), GeneralIndex(2))
            pallet = first.value.toString();
            switch (second.__kind) {
              case 'GeneralIndex':
                assetId = second.value.toString();
                break;
              case 'GeneralKey':
                assetId = 'data' in second ? second.data : second.value;
                break;
            }
            return { parents, pallet, assetId, fullPath: [`PalletInstance(${pallet})`, `${second.__kind}(${assetId})`] };

          case 'Parachain':
            // Cross-chain: parents=1, X2(Parachain(2000), ...)
            parachain = first.value.toString();
            switch (second.__kind) {
              case 'PalletInstance':
                pallet = second.value.toString();
                break;
              case 'GeneralIndex':
                assetId = second.value.toString();
                break;
              case 'GeneralKey':
                assetId = 'data' in second ? second.data : second.value;
                break;
            }
            return { parents, pallet, assetId, parachain, fullPath: [`Parachain(${parachain})`, `${second.__kind}(${assetId})`] };
        }

        return {
          parents,
          pallet: null,
          assetId: null,
          error: 'Unknown X2 pattern',
        };
      }

      case 'X3':
      case 'X4':
      case 'X5':
      case 'X6':
      case 'X7':
      case 'X8': {
        const junctions = location.interior.value;

        // Preserve full path for complex routing
        const fullPath = junctions.map((junction) => {
          switch (junction.__kind) {
            case 'Parachain':
              return `Parachain(${junction.value})`;
            case 'PalletInstance':
              return `PalletInstance(${junction.value})`;
            case 'GeneralIndex':
              return `GeneralIndex(${junction.value})`;
            case 'GeneralKey':
              const keyData = 'data' in junction ? junction.data : junction.value;
              return `GeneralKey(${keyData})`;
            case 'AccountId32':
              return `AccountId32(${junction.id})`;
            case 'Plurality':
              return `Plurality(${junction.id.__kind})`;
            default:
              return `${junction.__kind}(unknown)`;
          }
        });

        // Extract key components for backwards compatibility
        const parachains = (junctions.filter((j) => j.__kind === 'Parachain') as (V1Junction_Parachain | V3Junction_Parachain)[]).map((j) => j.value);
        const palletJunction = junctions.find((j) => j.__kind === 'PalletInstance') as V1Junction_PalletInstance | V3Junction_PalletInstance;
        const assetJunctions = junctions.filter((j) => j.__kind === 'GeneralIndex' || j.__kind === 'GeneralKey') as (
          | V1Junction_GeneralIndex
          | V3Junction_GeneralIndex
        )[];

        // Determine primary target
        let targetParachain = null;
        let pallet = null;
        let assetId = null;

        // For multi-hop, use the last parachain as the target
        if (parachains.length > 0) {
          targetParachain = parachains[parachains.length - 1].toString();
        }

        if (palletJunction) {
          pallet = palletJunction.value.toString();
        }

        // Use the last asset junction as the primary asset ID
        if (assetJunctions.length > 0) {
          const lastAsset = assetJunctions[assetJunctions.length - 1];
          if (lastAsset.__kind === 'GeneralIndex') {
            assetId = lastAsset.value.toString();
          } else if (lastAsset.__kind === 'GeneralKey') {
            assetId = 'data' in lastAsset ? lastAsset.data : lastAsset.value;
          }
        }

        return {
          parents,
          pallet,
          assetId,
          parachain: targetParachain,
          fullPath, // Full junction path preserved
        };
      }

      default:
        return { parents, pallet: null, assetId: null, error: 'Unknown interior kind' };
    }
  });
}
