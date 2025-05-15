import { events } from '@/chain/astar/types';
import { UnknownVersionError } from '@/utils';
import { Event, ISentEventPalletDecoder } from '@/indexer';

import assert from 'assert';
import { V1MultiLocation, V2Instruction, V2Instruction_BuyExecution } from '@/chain/astar/types/v15';
import {
  V1MultiLocation as V1MultiLocationV52,
  V2Instruction as V2InstructionV52,
  V2Instruction_BuyExecution as V2Instruction_BuyExecutionV52,
} from '@/chain/astar/types/v52';
import { V3Instruction, V3Instruction_BuyExecution, V3MultiLocation } from '@/chain/astar/types/v61';
import { V4Instruction, V4Location, V4Instruction_BuyExecution } from '@/chain/astar/types/v91';

export class SentEventPalletDecoder implements ISentEventPalletDecoder {
  decode(event: Event) {
    assert(event.call);
    const sent = events.polkadotXcm.sent;

    if (sent.v15.is(event)) {
      const [origin, destination, message] = sent.v15.decode(event);
      const from = getOriginCaller(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V2Instruction_BuyExecution;
      return {
        from,
        to: getTarget(message.at(-1)!, from),
        toChain: getDestination(destination),
        amount: getAmount(message[0]),
        weightLimit: getWeightLimit(weightLimitMsg),
        contractCalled: event?.call?.args?.transaction?.value?.action?.value,
        contractInput: event?.call?.args?.transaction?.value?.input,
      };
    } else if (sent.v52.is(event)) {
      const [origin, destination, message] = sent.v52.decode(event);
      const from = getOriginCaller(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V2Instruction_BuyExecutionV52;
      return {
        to: getTarget(message.at(-1)!, from),
        toChain: getDestination(destination),
        amount: getAmount(message[0]),
        weightLimit: getWeightLimit(weightLimitMsg),
        from,
        contractCalled: event?.call?.args?.transaction?.value?.action?.value,
        contractInput: event?.call?.args?.transaction?.value?.input,
      };
    } else if (sent.v61.is(event)) {
      const [origin, destination, message] = sent.v61.decode(event);
      const from = getOriginCaller(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V3Instruction_BuyExecution;
      return {
        to: getTarget(message.at(-1)!, from),
        toChain: getDestination(destination),
        amount: getAmount(message[0]),
        weightLimit: getWeightLimitV3V4(weightLimitMsg),
        from,
        contractCalled: event?.call?.args?.transaction?.value?.action?.value,
        contractInput: event?.call?.args?.transaction?.value?.input,
      };
    } else if (sent.v82.is(event)) {
      const { origin, destination, message, messageId } = sent.v82.decode(event);
      const from = getOriginCaller(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V3Instruction_BuyExecution;
      return {
        to: getTarget(message.at(-1)!, from),
        toChain: getDestination(destination),
        amount: getAmount(message[0]),
        weightLimit: getWeightLimitV3V4(weightLimitMsg),
        from,
        contractCalled: event?.call?.args?.transaction?.value?.action?.value,
        contractInput: event?.call?.args?.transaction?.value?.input,
      };
    } else if (sent.v91.is(event)) {
      const { origin, destination, message, messageId } = sent.v91.decode(event);
      const from = getOriginCallerV4(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V4Instruction_BuyExecution;
      return {
        to: getTargetV4(message.at(-1)!, from),
        toChain: getDestinationV4(destination),
        amount: getAmount(message[0]),
        weightLimit: getWeightLimitV3V4(weightLimitMsg),
        from,
        contractCalled: event?.call?.args?.transaction?.value?.action?.value,
        contractInput: event?.call?.args?.transaction?.value?.input,
      };
    }

    throw new UnknownVersionError(sent);
  }
}

function getOriginCaller(origin: V1MultiLocation | V1MultiLocationV52 | V3MultiLocation) {
  if (origin.interior.__kind === 'X1') {
    switch (origin.interior.value.__kind) {
      case 'AccountId32':
        return origin.interior.value.id;
      case 'AccountKey20':
        return origin.interior.value.key;
    }
  }

  return;
}

function getOriginCallerV4(origin: V4Location) {
  if (origin.interior.__kind === 'X1') {
    switch (origin.interior.value[0].__kind) {
      case 'AccountId32':
        return origin.interior.value[0].id;
      case 'AccountKey20':
        return origin.interior.value[0].key;
    }
  }
}

function getDestination(destination: V1MultiLocation | V1MultiLocationV52 | V3MultiLocation) {
  if (destination.interior.__kind === 'X1') {
    switch (destination.interior.value.__kind) {
      case 'Parachain':
        return destination.interior.value.value.toString();
      case 'AccountId32':
        return destination.interior.value.id;
      case 'AccountKey20':
        return destination.interior.value.key;
    }

    return;
  }
  // Destination is the relay chain
  else if (destination.interior.__kind === 'Here') {
    return destination.interior.__kind;
  }

  return;
}

function getDestinationV4(destination: V4Location) {
  if (destination.interior.__kind === 'X1') {
    switch (destination.interior.value[0].__kind) {
      case 'Parachain':
        return destination.interior.value[0].value.toString();
      case 'AccountId32':
        return destination.interior.value[0].id;
      case 'AccountKey20':
        return destination.interior.value[0].key;
    }

    return;
  }
  // Destination is the relay chain
  else if (destination.interior.__kind === 'Here') {
    return destination.interior.__kind;
  }

  return;
}

function getAmount(message: V2Instruction | V2InstructionV52 | V3Instruction | V4Instruction) {
  switch (message.__kind) {
    case 'WithdrawAsset':
    case 'ReserveAssetDeposited':
      return message.value[0].fun.__kind === 'Fungible' ? message.value[0].fun.value : undefined;
    case 'TransferReserveAsset':
      return message.assets[0].fun.__kind === 'Fungible' ? message.assets[0].fun.value : undefined;
    default:
      return;
  }
}

function getTarget(message: V2Instruction | V2InstructionV52 | V3Instruction, from?: string) {
  // Call are to other parachains
  if (message.__kind === 'DepositAsset') {
    if (message.beneficiary.interior.__kind === 'X1') {
      switch (message.beneficiary.interior.value.__kind) {
        case 'AccountId32':
          return message.beneficiary.interior.value.id;
        case 'AccountKey20':
          return message.beneficiary.interior.value.key;
        default:
          return;
      }
    }
  }

  // Calls are to assetHub
  if (message?.__kind !== 'DepositAsset') {
    return from;
  }

  return;
}

function getTargetV4(message: V4Instruction, from?: string) {
  // Call are to other parachains
  if (message.__kind === 'DepositAsset') {
    if (message.beneficiary.interior.__kind === 'X1') {
      switch (message.beneficiary.interior.value[0].__kind) {
        case 'AccountId32':
          return message.beneficiary.interior.value[0].id;
        case 'AccountKey20':
          return message.beneficiary.interior.value[0].key;
        default:
          return;
      }
    }
  }

  // Calls are to assetHub
  if (message?.__kind !== 'DepositAsset') {
    return from;
  }

  return;
}

function getWeightLimit(message: V2Instruction_BuyExecution | V2Instruction_BuyExecutionV52 | undefined) {
  if (message?.weightLimit?.__kind === 'Limited') return message.weightLimit.value;
  else return;
}

function getWeightLimitV3V4(message: V3Instruction_BuyExecution | V4Instruction_BuyExecution | undefined) {
  if (message?.weightLimit?.__kind === 'Limited') return message.weightLimit.value.proofSize;
  else return;
}
