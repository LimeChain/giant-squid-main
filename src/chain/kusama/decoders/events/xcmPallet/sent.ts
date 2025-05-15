import { events } from '@/chain/kusama/types';
import { UnknownVersionError } from '@/utils';
import { Event, ISentEventPalletDecoder } from '@/indexer';

import assert from 'assert';
import { V1MultiLocation, V2Instruction, V2Instruction_BuyExecution } from '@/chain/kusama/types/v9111';
import { V1MultiLocation as V1MultiLocationV970, V2Instruction as V2InstructionV970 } from '@/chain/kusama/types/v9160';
import { V1MultiLocation as V1MultiLocationV9370, V2Instruction as V2InstructionV9370 } from '@/chain/kusama/types/v9370';
import { V3MultiLocation, V3Instruction, V3Instruction_BuyExecution } from '@/chain/kusama/types/v9381';
import { V3MultiLocation as V3MultiLocationV10000, V3Instruction as V3InstructionV10000 } from '@/chain/kusama/types/v1000000';
import { V4Location, V4Instruction, V4Instruction_BuyExecution } from '@/chain/kusama/types/v1002000';
import { V5Instruction } from '@/chain/kusama/types/v1005000';

export class SentEventPalletDecoder implements ISentEventPalletDecoder {
  decode(event: Event) {
    assert(event.call);
    const sent = events.xcmPallet.sent;

    if (sent.v9111.is(event)) {
      const [origin, destination, message] = sent.v9111.decode(event);
      const from = getOriginCaller(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V2Instruction_BuyExecution;
      return {
        from,
        toChain: getDestination(destination),
        amount: getAmount(message[0]),
        to: getTarget(message.at(-1)!, from),
        weightLimit: getWeightLimit(weightLimitMsg),
      };
    } else if (sent.v9160.is(event)) {
      const [origin, destination, message] = sent.v9160.decode(event);
      const from = getOriginCaller(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V2Instruction_BuyExecution;
      return {
        from,
        toChain: getDestination(destination),
        amount: getAmount(message[0]),
        to: getTarget(message.at(-1)!, from),
        weightLimit: getWeightLimit(weightLimitMsg),
      };
    } else if (sent.v9370.is(event)) {
      const [origin, destination, message] = sent.v9370.decode(event);
      const from = getOriginCaller(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V2Instruction_BuyExecution;
      return {
        from,
        toChain: getDestination(destination),
        amount: getAmount(message[0]),
        to: getTarget(message.at(-1)!, from),
        weightLimit: getWeightLimit(weightLimitMsg),
      };
    } else if (sent.v9381.is(event)) {
      const [origin, destination, message] = sent.v9381.decode(event);
      const from = getOriginCaller(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V3Instruction_BuyExecution;
      return {
        from,
        toChain: getDestination(destination),
        amount: getAmount(message[0]),
        to: getTarget(message.at(-1)!, from),
        weightLimit: getWeightLimitV3V4(weightLimitMsg),
      };
    } else if (sent.v1000000.is(event)) {
      const { origin, destination, message, messageId } = sent.v1000000.decode(event);
      const from = getOriginCaller(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V3Instruction_BuyExecution;
      return {
        from,
        toChain: getDestination(destination),
        amount: getAmount(message[0]),
        to: getTarget(message.at(-1)!, from),
        weightLimit: getWeightLimitV3V4(weightLimitMsg),
      };
    } else if (sent.v1002000.is(event)) {
      const { origin, destination, message, messageId } = sent.v1002000.decode(event);
      const from = getOriginCallerV4(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V4Instruction_BuyExecution;
      return {
        from,
        toChain: getDestinationV4(destination),
        amount: getAmount(message[0]),
        to: getTargetV4(message.at(-1)!, from),
        weightLimit: getWeightLimitV3V4(weightLimitMsg),
      };
    } else if (sent.v1005000.is(event)) {
      const { origin, destination, message, messageId } = sent.v1005000.decode(event);
      const from = getOriginCallerV4(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V4Instruction_BuyExecution;
      return {
        from,
        toChain: getDestinationV4(destination),
        amount: getAmount(message[0]),
        to: getTargetV4(message.at(-1)!, from),
        weightLimit: getWeightLimitV3V4(weightLimitMsg),
      };
    }

    throw new UnknownVersionError(sent);
  }
}

function getOriginCaller(origin: V1MultiLocation | V1MultiLocationV9370 | V3MultiLocation | V3MultiLocationV10000 | V1MultiLocationV970) {
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

  return;
}

function getDestination(destination: V1MultiLocation | V1MultiLocationV9370 | V3MultiLocation | V3MultiLocationV10000 | V1MultiLocationV970) {
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

function getAmount(message: V2Instruction | V2InstructionV9370 | V2InstructionV970 | V3Instruction | V3InstructionV10000 | V4Instruction | V5Instruction) {
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

function getTarget(message: V2Instruction | V2InstructionV9370 | V2InstructionV970 | V3Instruction | V3InstructionV10000, from?: string) {
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

function getTargetV4(message: V4Instruction | V5Instruction, from?: string) {
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

function getWeightLimit(message: V2Instruction_BuyExecution | undefined) {
  if (message?.weightLimit?.__kind === 'Limited') return message.weightLimit.value;
  else return;
}

function getWeightLimitV3V4(message: V3Instruction_BuyExecution | V4Instruction_BuyExecution | undefined) {
  if (message?.weightLimit?.__kind === 'Limited') return message.weightLimit.value.proofSize;
  else return;
}
