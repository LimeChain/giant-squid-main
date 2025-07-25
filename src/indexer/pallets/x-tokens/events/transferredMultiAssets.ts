// @ts-ignore
import { TransferredAssetsEventPalletHandler } from './transferredAssets';

export class TransferredMultiAssetsEventPalletHandler extends TransferredAssetsEventPalletHandler {}

// All types are similar for all parachains
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
import {
  V4Asset,
  V4Location,
  V4Junction,
  V4Junction_Parachain,
  V4Junction_PalletInstance,
  V4Junction_GeneralIndex,
  V4Junction_AccountId32,
  V4Junction_AccountKey20,
  V4Junction_GeneralKey,
} from '@/chain/acala/types/v2250';

// V1 to V3 Junctions are similar, so we can use the same function
export function getDestination(destination: V1MultiLocation | V1MultiLocationV2040 | V3MultiLocation | V3MultiLocationV2240, currentChain?: string | null) {
  const { parents, interior } = destination;

  // Same chain destination
  if (parents === 0) {
    switch (interior.__kind) {
      case 'Here':
        return '0'; // Relay chain (Kusama/Polkadot)
      case 'X1':
        switch (interior.value.__kind) {
          case 'Parachain':
            return interior.value.value.toString();
          default:
            return currentChain; // Same chain destination
        }
      default:
        return currentChain; // Same chain destination
    }
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

export function getTransferTarget(destination: V1MultiLocation | V1MultiLocationV2040 | V3MultiLocation | V3MultiLocationV2240) {
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

export function extractTargetFromJunction(junction: V1Junction | V1JunctionV2040 | V3Junction | V3JunctionV2240) {
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

export function getAssetAmounts(assets: (V1MultiAsset | V1MultiAssetV2040 | V3MultiAsset | V3MultiAssetV2240)[]) {
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

export function getRawAssetLocations(assets: (V1MultiAsset | V3MultiAsset | V3MultiAssetV2240 | V1MultiAssetV2040)[]) {
  return assets.map(
    (
      asset
    ): { parents?: number | null; pallet?: string | null; assetId?: string | null; parachain?: string | null; fullPath?: string[]; error?: string | null } => {
      // We only support concrete assets for now (have not found any examples of abstract assets yet)
      if (asset.id.__kind !== 'Concrete') {
        return {
          parents: null,
          pallet: null,
          assetId: null,
          fullPath: [] as string[],
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
              return { parents, pallet: null, assetId: null, fullPath: [] as string[], error: 'Unknown X1 junction type' };
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
              return { parents, pallet, assetId, parachain, fullPath: [`Parachain(${parachain})`, `${second.__kind}(${assetId ?? pallet})`] };
          }

          return {
            parents,
            pallet: null,
            assetId: null,
            fullPath: [] as string[],
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
              case 'AccountKey20':
                return `AccountKey20(${junction.key})`;
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
              assetId = 'data' in lastAsset ? (lastAsset.data as string) : (lastAsset.value.toString() as string);
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
          return { parents, pallet: null, assetId: null, fullPath: [] as string[], error: 'Unknown interior kind' };
      }
    }
  );
}

// V4 XCM Functions
export function getDestinationV4(destination: V4Location, currentChain?: string | null) {
  const { parents, interior } = destination;

  // Same chain destination
  if (parents === 0) {
    switch (interior.__kind) {
      case 'Here':
        return '0'; // Relay chain (Kusama/Polkadot)
      case 'X1':
        switch (interior.value[0].__kind) {
          case 'Parachain':
            return interior.value[0].value.toString();
          default:
            return currentChain; // Same chain destination
        }
      default:
        return currentChain; // Same chain destination
    }
  }

  // Parent chain or cross-chain destination
  if (parents === 1) {
    switch (interior.__kind) {
      case 'Here':
        return '0'; // Relay chain (Kusama/Polkadot)

      case 'X1':
        const junction = interior.value[0];
        if (junction.__kind === 'Parachain') {
          return junction.value.toString();
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
        const parachainJunctions = interior.value.filter((e) => e.__kind === 'Parachain') as V4Junction_Parachain[];

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

export function getTransferTargetV4(destination: V4Location) {
  const { interior } = destination;

  switch (interior.__kind) {
    case 'Here':
      // Transfer to the chain itself (no specific account target)
      return { type: 'Here', value: '0' };

    case 'X1':
      return extractTargetFromJunctionV4(interior.value[0]);

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
      const accountId32 = junctions.find((j) => j.__kind === 'AccountId32') as V4Junction_AccountId32;
      if (accountId32) {
        return { type: 'AccountId32', value: accountId32.id };
      }

      // Then try AccountKey20 (EVM addresses)
      const accountKey20 = junctions.find((j) => j.__kind === 'AccountKey20') as V4Junction_AccountKey20;
      if (accountKey20) {
        return { type: 'AccountKey20', value: accountKey20.key };
      }

      // Finally try GeneralKey (custom identifiers)
      const generalKey = junctions.find((j) => j.__kind === 'GeneralKey') as V4Junction_GeneralKey;
      if (generalKey) {
        return { type: 'GeneralKey', value: generalKey.data };
      }

      // No specific account target found - transfer to the chain/pallet level
      return { type: 'Here', value: '0' };

    default:
      return { type: 'Unknown', value: null };
  }
}

export function extractTargetFromJunctionV4(junction: V4Junction) {
  switch (junction.__kind) {
    case 'AccountId32':
      return { type: 'AccountId32', value: junction.id };

    case 'AccountKey20':
      return { type: 'AccountKey20', value: junction.key };

    case 'GeneralKey':
      return { type: 'GeneralKey', value: junction.data };

    case 'Parachain':
      // Transfer to a parachain (no specific account)
      return { type: 'Parachain', value: junction.value.toString() };

    case 'PalletInstance':
      // Transfer to a pallet (no specific account)
      return { type: 'PalletInstance', value: junction.value.toString() };

    case 'GeneralIndex':
      // Transfer by general index
      return { type: 'GeneralIndex', value: junction.value.toString() };

    default:
      return { type: 'Unknown', value: null };
  }
}

export function getAssetAmountsV4(assets: V4Asset[]) {
  return assets.map((asset) => {
    // Most common case
    if (asset.fun.__kind === 'Fungible') {
      return { type: asset.fun.__kind, value: asset.fun.value.toString() };
    }

    // Non-fungible assets
    if (asset.fun.__kind === 'NonFungible') {
      switch (asset.fun.value.__kind) {
        case 'Array32':
        case 'Array16':
        case 'Array8':
        case 'Array4':
          return { type: asset.fun.value.__kind, value: asset.fun.value.value };
        case 'Index':
          return { type: 'Index', value: asset.fun.value.value.toString() };
        case 'Undefined':
          return { type: 'Undefined', value: null };
        default:
          return { type: 'Unknown', value: null };
      }
    }

    return { type: 'Unknown', value: null };
  });
}

export function getRawAssetLocationsV4(assets: V4Asset[]) {
  return assets.map(
    (
      asset
    ): { parents?: number | null; pallet?: string | null; assetId?: string | null; parachain?: string | null; fullPath?: string[]; error?: string | null } => {
      const location = asset.id; // V4AssetId is essentially a V4Location
      const parents = location.parents;
      let pallet: string | null = null;
      let assetId: string | null = null;
      let parachain: string | null = null;

      switch (location.interior.__kind) {
        case 'Here':
          // Relay chain native: parents=1, Here
          return { parents, pallet: null, assetId: null, fullPath: ['Here'] };

        case 'X1':
          const junction = location.interior.value[0];
          switch (junction.__kind) {
            case 'PalletInstance':
              // Same chain native: parents=0, X1(PalletInstance(10))
              pallet = junction.value.toString();
              return { parents, pallet, assetId: null, fullPath: [`PalletInstance(${pallet})`] };
            case 'Parachain':
              // Cross-chain reference: parents=1, X1(Parachain(2000))
              parachain = junction.value.toString();
              return { parents, pallet: null, assetId: null, parachain, fullPath: [`Parachain(${parachain})`] };
            case 'GeneralIndex':
              // Asset by index: parents=0, X1(GeneralIndex(5))
              assetId = junction.value.toString();
              return { parents, pallet: null, assetId, fullPath: [`GeneralIndex(${assetId})`] };
            case 'GeneralKey':
              // Asset by key: parents=0, X1(GeneralKey(...))
              assetId = junction.data;
              return { parents, pallet: null, assetId, fullPath: [`GeneralKey(${junction.data})`] };
            default:
              return { parents, pallet: null, assetId: null, fullPath: [] as string[], error: 'Unknown X1 junction type' };
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
                  assetId = second.data;
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
                  assetId = second.data;
                  break;
              }
              return { parents, pallet, assetId, parachain, fullPath: [`Parachain(${parachain})`, `${second.__kind}(${assetId ?? pallet})`] };
          }

          return {
            parents,
            pallet: null,
            assetId: null,
            fullPath: [] as string[],
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
                return `GeneralKey(${junction.data})`;
              case 'AccountId32':
                return `AccountId32(${junction.id})`;
              case 'AccountKey20':
                return `AccountKey20(${junction.key})`;
              case 'Plurality':
                return `Plurality(${junction.id.__kind})`;
              default:
                return `${junction.__kind}(unknown)`;
            }
          });

          // Extract key components for backwards compatibility
          const parachains = (junctions.filter((j) => j.__kind === 'Parachain') as V4Junction_Parachain[]).map((j) => j.value);
          const palletJunction = junctions.find((j) => j.__kind === 'PalletInstance') as V4Junction_PalletInstance;
          const assetJunctions = junctions.filter((j) => j.__kind === 'GeneralIndex' || j.__kind === 'GeneralKey') as (
            | V4Junction_GeneralIndex
            | V4Junction_GeneralKey
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
              assetId = lastAsset.data;
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
          return { parents, pallet: null, assetId: null, fullPath: [] as string[], error: 'Unknown interior kind' };
      }
    }
  );
}
