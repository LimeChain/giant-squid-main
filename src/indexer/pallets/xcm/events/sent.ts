// All types are similar for all parachains
import {
  V1Junction_AccountId32,
  V1Junction_AccountKey20,
  V1Junction_GeneralKey,
  V1Junction_Parachain,
  V1MultiAsset,
  V1MultiLocation,
  V2Instruction,
  V2Instruction_BuyExecution,
} from '@/chain/kusama/types/v9160';
import {
  V1MultiLocation as V1MultiLocationV9111,
  V2Instruction as V2InstructionV9111,
  V2Instruction_BuyExecution as V2Instruction_BuyExecutionV9111,
} from '@/chain/kusama/types/v9111';
import {
  V1MultiLocation as V1MultiLocationV9370,
  V2Instruction as V2InstructionV9370,
  V2Instruction_BuyExecution as V2Instruction_BuyExecutionV9370,
} from '@/chain/kusama/types/v9370';
import { V3Instruction, V3Instruction_BuyExecution, V3Junction, V3Junction_GeneralKey, V3MultiAsset, V3MultiLocation } from '@/chain/kusama/types/v9381';
import { V4Instruction, V4Location, V4Instruction_BuyExecution, V4Junction, V4Junction_GeneralKey, V4Junction_Parachain } from '@/chain/kusama/types/v1002000';
import { V5Instruction, V5Instruction_BuyExecution } from '@/chain/kusama/types/v1005000';

import { Account } from '@/model';
import { IBasePalletSetup, IEventPalletDecoder } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { EnsureAccount } from '@/indexer/actions';
import assert from 'assert';
import { jsonStringify } from '@/utils';
import { XcmTransferAction } from '@/indexer/actions/xcm/transfer';

export interface IXcmSentEventPalletDecoder extends IEventPalletDecoder<any> {}
// TODO: add type
// extends IEventPalletDecoder<
//   | {
//       from?: {
//         type: string;
//         value: string;
//       };
//       to?: {
//         type: string;
//         value: string;
//       };
//       toChain?: string | null;
//       asset?: {
//         parents: number;
//         pallet: string | null;
//         assetId: string | null;
//         parachain?: string | null;
//         fullPath?: string[];
//         error?: string;
//       };
//       amount?: { type: string; value: string | null };
//       weightLimit?: bigint | null;
//       contractCalled?: string;
//       contractInput?: string;
//     }
//   | undefined
// > {}

interface IXcmSentEventPalletSetup extends IBasePalletSetup {
  decoder: IXcmSentEventPalletDecoder;
}

export class XcmSentEventPalletHandler extends EventPalletHandler<IXcmSentEventPalletSetup> {
  constructor(setup: IXcmSentEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, block, queue, item: event }: IEventHandlerParams) {
    // Return on failed calls
    if (!event?.call?.success) return;

    const data = this.decoder.decode(event);
    // Return on unsupported event types
    if (!data) return;

    // Skip on asset error
    if (data.asset?.error) {
      console.error(`
        XCM SENT ERROR:
        HASH: ${event.extrinsic?.hash}
        ASSET ERROR: ${jsonStringify(data)}
      `);
      return;
    }

    // Skip on origin caller error
    if (!data.from?.value) {
      console.error(`
          XCM SENT ERROR:
          HASH: ${event.extrinsic?.hash}
          ORIGIN CALLER ERROR: ${jsonStringify(data)}
        `);
      return;
    }

    // Using try/catch block to skip Multisig(As_multi) call, which emits the [Xcm.Sent] event,
    // as current [fromPubKey] encoding logic doesn't support it
    try {
      const { amount, weightLimit, to, toChain, from, contractCalled, contractInput, asset } = data;
      assert(from, `Caller Pubkey is undefined at ${event.extrinsic?.hash}`);

      const fromPubKey = this.encodeAddress(from.value);
      const account = ctx.store.defer(Account, fromPubKey);

      queue.push(
        new EnsureAccount(block.header, event.extrinsic, {
          account: () => account.get(),
          id: fromPubKey,
          pk: this.decodeAddress(fromPubKey),
        }),
        new XcmTransferAction(block.header, event.extrinsic, {
          id: event.id,
          account: () => account.getOrFail(),
          amount,
          to,
          toChain,
          call: event.call.name,
          weightLimit,
          contractCalled,
          contractInput,
          asset,
        })
      );
    } catch (error) {
      console.error({
        error,
        data,
        extrinsic: event.extrinsic?.hash,
        fullPath: data.asset?.fullPath,
        message: 'Error decoding Xcm.Sent event',
      });
    }
  }
}

export function getOriginCaller(origin: V1MultiLocation | V1MultiLocationV9111 | V1MultiLocationV9370 | V3MultiLocation) {
  const { interior } = origin;

  switch (interior.__kind) {
    case 'Here':
      // Origin is the chain itself (system account)
      return { type: 'Here', value: null };

    case 'X1':
      return extractCallerFromJunction(interior.value);

    case 'X2':
    case 'X3':
    case 'X4':
    case 'X5':
    case 'X6':
    case 'X7':
    case 'X8':
      // Find the account in the junction path
      // Most likely in the last junction for complex origins
      const junctions = interior.value;

      // First try to find AccountId32 (most common)
      const accountId32 = junctions.find((j) => j.__kind === 'AccountId32') as V1Junction_AccountId32;
      if (accountId32) {
        return { type: 'AccountId32', value: accountId32.id };
      }

      // Then try AccountKey20 (EVM addresses)
      const accountKey20 = junctions.find((j) => j.__kind === 'AccountKey20') as V1Junction_AccountKey20;
      if (accountKey20) {
        return { type: 'AccountKey20', value: accountKey20.key };
      }

      // Fallback to system origin
      return { type: 'Here', value: null };

    default:
      return { type: 'Unknown', value: null };
  }
}

export function getOriginCallerV4(origin: V4Location) {
  const { interior } = origin;

  switch (interior.__kind) {
    case 'Here':
      // Origin is the chain itself (system account)
      return { type: 'Here', value: null };

    case 'X1':
      return extractCallerFromJunctionV4(interior.value[0]);

    case 'X2':
    case 'X3':
    case 'X4':
    case 'X5':
    case 'X6':
    case 'X7':
    case 'X8':
      // Find the account in the junction path
      const junctions = interior.value;

      // First try to find AccountId32 (most common)
      const accountId32 = junctions.find((j) => j.__kind === 'AccountId32') as V1Junction_AccountId32;
      if (accountId32) {
        return { type: 'AccountId32', value: accountId32.id };
      }

      // Then try AccountKey20 (EVM addresses)
      const accountKey20 = junctions.find((j) => j.__kind === 'AccountKey20') as V1Junction_AccountKey20;
      if (accountKey20) {
        return { type: 'AccountKey20', value: accountKey20.key };
      }

      // Fallback to system origin
      return { type: 'Here', value: null };

    default:
      return { type: 'Unknown', value: null };
  }
}

function extractCallerFromJunction(junction: any) {
  switch (junction.__kind) {
    case 'AccountId32':
      return { type: 'AccountId32', value: junction.id };
    case 'AccountKey20':
      return { type: 'AccountKey20', value: junction.key };
    case 'Parachain':
      return { type: 'Parachain', value: junction.value.toString() };
    default:
      return { type: 'Unknown', value: null };
  }
}

function extractCallerFromJunctionV4(junction: any) {
  switch (junction.__kind) {
    case 'AccountId32':
      return { type: 'AccountId32', value: junction.id };
    case 'AccountKey20':
      return { type: 'AccountKey20', value: junction.key };
    case 'Parachain':
      return { type: 'Parachain', value: junction.value.toString() };
    default:
      return { type: 'Unknown', value: null };
  }
}

export function getDestination(destination: V1MultiLocation | V1MultiLocationV9111 | V1MultiLocationV9370 | V3MultiLocation, currentChain?: string | null) {
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

export const SUPPORTED_ASSET_MESSAGE_TYPES = ['WithdrawAsset', 'ReserveAssetDeposited', 'ReceiveTeleportedAsset', 'TransferReserveAsset'];

export function getAssetAmount(message: V2Instruction | V2InstructionV9111 | V2InstructionV9370 | V3Instruction | undefined) {
  if (!message) return { type: 'Unknown', value: null };

  switch (message.__kind) {
    case 'WithdrawAsset':
    case 'ReserveAssetDeposited':
    case 'ReceiveTeleportedAsset':
      if (message.value && message.value[0]) {
        return message.value[0].fun.__kind === 'Fungible'
          ? { type: 'Fungible', value: message.value[0].fun.value.toString() }
          : { type: 'NonFungible', value: null };
      }
      break;
    case 'TransferReserveAsset':
      if (message.assets && message.assets[0]) {
        return message.assets[0].fun.__kind === 'Fungible'
          ? { type: 'Fungible', value: message.assets[0].fun.value.toString() }
          : { type: 'NonFungible', value: null };
      }
      break;
    default:
      return { type: 'Unknown', value: null };
  }
  return { type: 'Unknown', value: null };
}

export function getAssetAmountV4(message: V4Instruction | V5Instruction | undefined) {
  if (!message) return { type: 'Unknown', value: null };

  switch (message.__kind) {
    case 'WithdrawAsset':
    case 'ReserveAssetDeposited':
    case 'ReceiveTeleportedAsset':
      if (message.value && message.value[0]) {
        return message.value[0].fun.__kind === 'Fungible'
          ? { type: 'Fungible', value: message.value[0].fun.value.toString() }
          : { type: 'NonFungible', value: null };
      }
      break;
    case 'TransferReserveAsset':
      if (message.assets && message.assets[0]) {
        return message.assets[0].fun.__kind === 'Fungible'
          ? { type: 'Fungible', value: message.assets[0].fun.value.toString() }
          : { type: 'NonFungible', value: null };
      }
      break;
    default:
      return { type: 'Unknown', value: null };
  }
  return { type: 'Unknown', value: null };
}

export function getTransferTarget(message: V2Instruction | V2InstructionV9111 | V2InstructionV9370 | V3Instruction, from?: string) {
  if (!message) return { type: 'Unknown', value: null };

  // Calls are to other parachains
  if (message.__kind === 'DepositAsset') {
    const { interior } = message.beneficiary;

    switch (interior.__kind) {
      case 'Here':
        return { type: 'Here', value: null };

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
        const junctions = interior.value;

        // First try to find AccountId32 (most common)
        const accountId32 = junctions.find((j: any) => j.__kind === 'AccountId32');
        if (accountId32 && accountId32.__kind === 'AccountId32') {
          return { type: 'AccountId32', value: accountId32.id };
        }

        // Then try AccountKey20 (EVM addresses)
        const accountKey20 = junctions.find((j: any) => j.__kind === 'AccountKey20');
        if (accountKey20 && accountKey20.__kind === 'AccountKey20') {
          return { type: 'AccountKey20', value: accountKey20.key };
        }

        // Finally try GeneralKey (custom identifiers)
        const generalKey = junctions.find((j: any) => j.__kind === 'GeneralKey') as V1Junction_GeneralKey | V3Junction_GeneralKey;
        if (generalKey) {
          // Handle both V1/V2 (value) and V3+ (data) formats
          const keyValue = 'data' in generalKey ? generalKey.data : generalKey.value;
          return { type: 'GeneralKey', value: keyValue };
        }

        // No specific account target found
        return { type: 'Here', value: null };

      default:
        return { type: 'Unknown', value: null };
    }
  }

  // Calls are to assetHub or same chain
  return { type: 'Unknown', value: from || null };
}

export function getTransferTargetV4(message: V4Instruction | V5Instruction, from?: string) {
  if (!message) return { type: 'Unknown', value: null };

  // Calls are to other parachains
  if (message.__kind === 'DepositAsset') {
    const { interior } = message.beneficiary;

    switch (interior.__kind) {
      case 'Here':
        return { type: 'Here', value: null };

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
        const junctions = interior.value;

        // First try to find AccountId32 (most common)
        const accountId32 = junctions.find((j) => j.__kind === 'AccountId32');
        if (accountId32 && accountId32.__kind === 'AccountId32') {
          return { type: 'AccountId32', value: accountId32.id };
        }

        // Then try AccountKey20 (EVM addresses)
        const accountKey20 = junctions.find((j) => j.__kind === 'AccountKey20');
        if (accountKey20 && accountKey20.__kind === 'AccountKey20') {
          return { type: 'AccountKey20', value: accountKey20.key };
        }

        // Finally try GeneralKey (custom identifiers)
        const generalKey = junctions.find((j) => j.__kind === 'GeneralKey') as V4Junction_GeneralKey;
        if (generalKey) {
          return { type: 'GeneralKey', value: generalKey.data };
        }

        // No specific account target found
        return { type: 'Here', value: null };

      default:
        return { type: 'Unknown', value: null };
    }
  }

  // Calls are to assetHub or same chain
  return { type: 'Unknown', value: from || null };
}

function extractTargetFromJunction(junction: any) {
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
      return { type: 'Parachain', value: junction.value.toString() };
    case 'PalletInstance':
      return { type: 'PalletInstance', value: junction.value.toString() };
    default:
      return { type: 'Unknown', value: null };
  }
}

function extractTargetFromJunctionV4(junction: any) {
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
      return { type: 'Parachain', value: junction.value.toString() };
    case 'PalletInstance':
      return { type: 'PalletInstance', value: junction.value.toString() };
    case 'GeneralIndex':
      // Transfer by general index
      return { type: 'GeneralIndex', value: junction.value.toString() };
    default:
      return { type: 'Unknown', value: null };
  }
}

export function getWeightLimit(message: V2Instruction_BuyExecution | V2Instruction_BuyExecutionV9111 | undefined) {
  if (message?.weightLimit?.__kind === 'Limited') return message.weightLimit.value;
  else return;
}

export function getWeightLimitV3V4(message: V3Instruction_BuyExecution | V4Instruction_BuyExecution | undefined) {
  if (message?.weightLimit?.__kind === 'Limited') return message.weightLimit.value.proofSize;
  else return;
}

export function getRawAssetFromInstruction(message: V2Instruction | V2InstructionV9111 | V2InstructionV9370 | V3Instruction | undefined) {
  if (!message)
    return {
      parents: null,
      pallet: null,
      assetId: null,
      error: 'No assets in instruction',
    };

  let assets: any[] = [];

  // Extract assets from different instruction types
  switch (message.__kind) {
    case 'WithdrawAsset':
    case 'ReserveAssetDeposited':
    case 'ReceiveTeleportedAsset':
      assets = message.value || [];
      break;
    case 'TransferReserveAsset':
      assets = message.assets || [];
      break;
    default:
      return {
        parents: null,
        pallet: null,
        assetId: null,
        error: 'No assets in instruction',
      };
  }

  if (assets.length === 0) {
    return {
      parents: null,
      pallet: null,
      assetId: null,
      error: 'No assets found',
    };
  }

  // Process the first asset (most common case)
  const asset = assets[0];

  // We only support concrete assets for now
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
          return { parents, pallet, assetId, parachain, fullPath: [`Parachain(${parachain})`, `${second.__kind}(${assetId ?? pallet})`] };
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
      const fullPath = junctions.map((junction: any) => {
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
      const parachains = (junctions.filter((j: any) => j.__kind === 'Parachain') as V1Junction_Parachain[]).map((j: any) => j.value);
      const palletJunction = junctions.find((j: any) => j.__kind === 'PalletInstance');
      const assetJunctions = junctions.filter((j: any) => j.__kind === 'GeneralIndex' || j.__kind === 'GeneralKey');

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
}

export function getRawAssetFromInstructionV4(message: V4Instruction | V5Instruction | undefined) {
  if (!message) return { type: 'Unknown', value: null };

  let assets: any[] = [];

  // Extract assets from different instruction types
  switch (message.__kind) {
    case 'WithdrawAsset':
    case 'ReserveAssetDeposited':
    case 'ReceiveTeleportedAsset':
      assets = message.value || [];
      break;
    case 'TransferReserveAsset':
      assets = message.assets || [];
      break;
    default:
      return {
        parents: null,
        pallet: null,
        assetId: null,
        error: 'No assets in instruction',
      };
  }

  if (assets.length === 0) {
    return {
      parents: null,
      pallet: null,
      assetId: null,
      error: 'No assets found',
    };
  }

  // Process the first asset (most common case)
  const asset = assets[0];

  // V4 assets have id as V4AssetId (which is essentially a V4Location)
  const location = asset.id;
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
      const fullPath = junctions.map((junction: any) => {
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
      const parachains = (junctions.filter((j: any) => j.__kind === 'Parachain') as V4Junction_Parachain[]).map((j: any) => j.value);
      const palletJunction = junctions.find((j: any) => j.__kind === 'PalletInstance');
      const assetJunctions = junctions.filter((j: any) => j.__kind === 'GeneralIndex' || j.__kind === 'GeneralKey');

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
      return { parents, pallet: null, assetId: null, error: 'Unknown interior kind' };
  }
}
