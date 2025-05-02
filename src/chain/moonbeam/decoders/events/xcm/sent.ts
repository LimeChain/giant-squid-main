import { events } from '@/chain/moonbeam/types';
import { UnknownVersionError } from '@/utils';
import { Event } from '@/indexer';
import { ISentEventPalletDecoder } from '@/indexer/pallets/polkadotXcm/events/sent';

import { TransferAssetsCallDecoder } from '../../calls/polkadotXcm/transferAssets';
import assert from 'assert';
import { V1MultiLocation, V2Instruction, V2Instruction_BuyExecution } from '@/chain/moonbeam/types/v1201';
import {
  V1MultiLocation as V1MultiLocationV1300,
  V2Instruction as V2InstructionV1300,
  V2Instruction_BuyExecution as V2Instruction_BuyExecution_V1300,
} from '@/chain/moonbeam/types/v1300';
import {
  V1MultiLocation as V1MultiLocationV2201,
  V2Instruction as V2InstructionV2201,
  V2Instruction_BuyExecution as V2Instruction_BuyExecution_V2201,
} from '@/chain/moonbeam/types/v2201';
import { V3Instruction, V3Instruction_BuyExecution, V3MultiLocation } from '@/chain/moonbeam/types/v2302';
import { V4Instruction, V4Location, V4Instruction_BuyExecution } from '@/chain/moonbeam/types/v2901';

const transferAssetsCallDecoder = new TransferAssetsCallDecoder();
export class SentEventPalletDecoder implements ISentEventPalletDecoder {
  decode(event: Event) {
    assert(event.call);
    const sent = events.polkadotXcm.sent;

    if (sent.v1201.is(event)) {
      const [origin, destination, message] = sent.v1201.decode(event);
      const from = getOriginCaller(origin);

      switch (event.call.name) {
        case 'Ethereum.transact':
          if (event.call.args.transaction.value.action.__kinds !== 'Call') {
            console.log({ hash: event.extrinsic?.hash });
          }

          const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V2Instruction_BuyExecution;
          return {
            to: getTarget(message.at(-1)!, from),
            toChain: getDestination(destination),
            amount: getAmount(message[0]),
            // not present in the call
            feeAssetItem: 0,
            weightLimit: getWeightLimit(weightLimitMsg),
            from,
            contractCalled: event.call.args.transaction.value.action.value,
            contractInput: event.call.args.transaction.value.input,
          };
        case 'PolkadotXcm.transfer_assets':
          return { ...transferAssetsCallDecoder.decode(event.call), from, contractCalled: null, contractInput: null };
        default:
          return null;
      }
    } else if (sent.v1300.is(event)) {
      const [origin, destination, message] = sent.v1300.decode(event);
      const from = getOriginCaller(origin);

      switch (event.call.name) {
        case 'Ethereum.transact':
          const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V2Instruction_BuyExecution_V1300;
          return {
            to: getTarget(message.at(-1)!, from),
            toChain: getDestination(destination),
            amount: getAmount(message[0]),
            // not present in the call
            feeAssetItem: 0,
            weightLimit: getWeightLimit(weightLimitMsg),
            from,
            contractCalled: event.call.args.transaction.value.action.value,
            contractInput: event.call.args.transaction.value.input,
          };
        case 'PolkadotXcm.transfer_assets':
          return { ...transferAssetsCallDecoder.decode(event.call), from, contractCalled: null, contractInput: null };
        default:
          return null;
      }
    } else if (sent.v2201.is(event)) {
      const [origin, destination, message] = sent.v2201.decode(event);
      const from = getOriginCaller(origin);

      switch (event.call.name) {
        case 'Ethereum.transact':
          const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V2Instruction_BuyExecution_V2201;

          return {
            to: getTarget(message.at(-1)!, from),
            toChain: getDestination(destination),
            amount: getAmount(message[0]),
            // not present in the call
            feeAssetItem: 0,
            weightLimit: getWeightLimit(weightLimitMsg),
            from,
            contractCalled: event.call.args.transaction.value.action.value,
            contractInput: event.call.args.transaction.value.input,
          };
        case 'PolkadotXcm.transfer_assets':
          return { ...transferAssetsCallDecoder.decode(event.call), from, contractCalled: null, contractInput: null };
        default:
          return null;
      }
    } else if (sent.v2302.is(event)) {
      const [origin, destination, message] = sent.v2302.decode(event);
      const from = getOriginCaller(origin);

      switch (event.call.name) {
        case 'Ethereum.transact':
          const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V3Instruction_BuyExecution;

          return {
            to: getTarget(message.at(-1)!, from),
            toChain: getDestination(destination),
            amount: getAmount(message[0]),
            // not present in the call
            feeAssetItem: 0,
            weightLimit: getWeightLimitV3V4(weightLimitMsg),
            from,
            contractCalled: event.call.args.transaction.value.action.value,
            contractInput: event.call.args.transaction.value.input,
          };
        case 'PolkadotXcm.transfer_assets':
          return { ...transferAssetsCallDecoder.decode(event.call), from, contractCalled: null, contractInput: null };
        default:
          return null;
      }
    } else if (sent.v2602.is(event)) {
      const { origin, destination, message, messageId } = sent.v2602.decode(event);
      const from = getOriginCaller(origin);

      switch (event.call.name) {
        case 'Ethereum.transact':
          const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V3Instruction_BuyExecution;
          return {
            to: getTarget(message.at(-1)!, from),
            toChain: getDestination(destination),
            amount: getAmount(message[0]),
            // not present in the call
            feeAssetItem: 0,
            weightLimit: getWeightLimitV3V4(weightLimitMsg),
            from,
            contractCalled: event.call.args.transaction.value.action.value,
            contractInput: event.call.args.transaction.value.input,
          };
        case 'PolkadotXcm.transfer_assets':
          return { ...transferAssetsCallDecoder.decode(event.call), from, contractCalled: null, contractInput: null };
        default:
          return null;
      }
    } else if (sent.v2901.is(event)) {
      const { origin, destination, message, messageId } = sent.v2901.decode(event);
      const from = getOriginCallerV4(origin);

      switch (event.call.name) {
        case 'Ethereum.transact':
          const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V4Instruction_BuyExecution;
          return {
            to: getTargetV4(message.at(-1)!, from),
            toChain: getDestinationV4(destination),
            amount: getAmount(message[0]),
            // not present in the call
            feeAssetItem: 0,
            weightLimit: getWeightLimitV3V4(weightLimitMsg),
            from,
            contractCalled: event.call.args.transaction.value.action.value,
            contractInput: event.call.args.transaction.value.input,
          };
        case 'PolkadotXcm.transfer_assets':
          return { ...transferAssetsCallDecoder.decode(event.call), from, contractCalled: null, contractInput: null };
        default:
          return null;
      }
    }

    throw new UnknownVersionError(sent);
  }
}

function getOriginCaller(origin: V1MultiLocation | V1MultiLocationV1300 | V3MultiLocation | V1MultiLocationV2201) {
  if (origin.interior.__kind === 'X1' && origin.interior.value.__kind === 'AccountKey20') {
    return origin.interior.value.key;
  }

  return null;
}

function getOriginCallerV4(origin: V4Location) {
  if (origin.interior.__kind === 'X1' && origin.interior.value[0].__kind === 'AccountKey20') {
    return origin.interior.value[0].key;
  }

  return null;
}

function getDestination(destination: V1MultiLocation | V1MultiLocationV1300 | V3MultiLocation | V1MultiLocationV2201) {
  if (destination.interior.__kind === 'X1' && destination.interior.value.__kind === 'Parachain') {
    return destination.interior.value.value.toString();
  } else if (destination.interior.__kind === 'Here') {
    return 'Here';
  }

  return null;
}

function getDestinationV4(destination: V4Location) {
  if (destination.interior.__kind === 'X1' && destination.interior.value[0].__kind === 'Parachain') {
    return destination.interior.value[0].value.toString();
  } else if (destination.interior.__kind === 'Here') {
    return 'Here';
  }

  return null;
}

function getAmount(message: V2Instruction | V2InstructionV1300 | V2InstructionV2201 | V3Instruction | V4Instruction) {
  switch (message.__kind) {
    case 'WithdrawAsset':
    case 'ReserveAssetDeposited':
      return message.value[0].fun.__kind === 'Fungible' ? message.value[0].fun.value : null;
    default:
      return null;
  }
}

function getTarget(message: V2Instruction | V2InstructionV1300 | V2InstructionV2201 | V3Instruction, from: string | null) {
  // Call are to other parachains
  if (message.__kind === 'DepositAsset') {
    if (message.beneficiary.interior.__kind === 'X1') {
      switch (message.beneficiary.interior.value.__kind) {
        case 'AccountId32':
          return message.beneficiary.interior.value.id;
        case 'AccountKey20':
          return message.beneficiary.interior.value.key;
        default:
          return null;
      }
    }
  }

  // Calls are to assetHub
  if (message?.__kind !== 'DepositAsset') {
    return from;
  }

  return null;
}

function getTargetV4(message: V4Instruction, from: string | null) {
  // Call are to other parachains
  if (message.__kind === 'DepositAsset') {
    if (message.beneficiary.interior.__kind === 'X1') {
      switch (message.beneficiary.interior.value[0].__kind) {
        case 'AccountId32':
          return message.beneficiary.interior.value[0].id;
        case 'AccountKey20':
          return message.beneficiary.interior.value[0].key;
        default:
          return null;
      }
    }
  }

  // Calls are to assetHub
  if (message?.__kind !== 'DepositAsset') {
    return from;
  }

  return null;
}

function getWeightLimit(message: V2Instruction_BuyExecution | V2Instruction_BuyExecution_V2201 | V2Instruction_BuyExecution_V1300 | undefined) {
  if (message?.weightLimit?.__kind === 'Limited') return message.weightLimit.value;
  else return null;
}

function getWeightLimitV3V4(message: V3Instruction_BuyExecution | V4Instruction_BuyExecution | undefined) {
  if (message?.weightLimit?.__kind === 'Limited') return message.weightLimit.value.proofSize;
  else return null;
}
