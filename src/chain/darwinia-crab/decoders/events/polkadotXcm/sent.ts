import { events } from '@/chain/darwinia-crab/types';
import { UnknownVersionError } from '@/utils';
import { Event, ISentEventPalletDecoder } from '@/indexer';

import assert from 'assert';
import { V1MultiLocation, V2Instruction, V2Instruction_BuyExecution } from '@/chain/darwinia-crab/types/v6000';
import { V3MultiLocation, V3Instruction, V3Instruction_BuyExecution } from '@/chain/darwinia-crab/types/v6020';
import { V3MultiLocation as V3MultiLocationV10000, V3Instruction as V3InstructionV10000 } from '@/chain/darwinia-crab/types/v6501';
import { V4Location, V4Instruction, V4Instruction_BuyExecution } from '@/chain/darwinia-crab/types/v6640';

export class SentEventPalletDecoder implements ISentEventPalletDecoder {
  decode(event: Event) {
    assert(event.call);
    const sent = events.polkadotXcm.sent;

    if (sent.v6000.is(event)) {
      const [origin, destination, message] = sent.v6000.decode(event);
      if (message.length <= 1) return;

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
    } else if (sent.v6020.is(event)) {
      const [origin, destination, message] = sent.v6020.decode(event);
      if (message.length <= 1) return;

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
    } else if (sent.v6501.is(event)) {
      const { origin, destination, message, messageId } = sent.v6501.decode(event);
      if (message.length <= 1) return;

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
    } else if (sent.v6640.is(event)) {
      const { origin, destination, message, messageId } = sent.v6640.decode(event);
      if (message.length <= 1) return;

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

function getOriginCaller(origin: V1MultiLocation | V3MultiLocation | V3MultiLocationV10000) {
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

function getDestination(destination: V1MultiLocation | V3MultiLocation | V3MultiLocationV10000) {
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

function getAmount(message: V2Instruction | V3Instruction | V3InstructionV10000 | V4Instruction) {
  switch (message.__kind) {
    case 'WithdrawAsset':
    case 'ReserveAssetDeposited':
      return message.value[0].fun.__kind === 'Fungible' ? message.value[0].fun.value : undefined;
    default:
      return;
  }
}

function getTarget(message: V2Instruction | V3Instruction | V3InstructionV10000, from?: string) {
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

function getWeightLimit(message: V2Instruction_BuyExecution | undefined) {
  if (message?.weightLimit?.__kind === 'Limited') return message.weightLimit.value;
  else return;
}

function getWeightLimitV3V4(message: V3Instruction_BuyExecution | V4Instruction_BuyExecution | undefined) {
  if (message?.weightLimit?.__kind === 'Limited') return message.weightLimit.value.proofSize;
  else return;
}
