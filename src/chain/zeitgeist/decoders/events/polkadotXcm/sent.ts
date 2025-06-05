import { events } from '@/chain/zeitgeist/types';
import { UnknownVersionError } from '@/utils';
import { Event, ISentEventPalletDecoder } from '@/indexer';

import assert from 'assert';
import { MultiLocation, InstructionV2_BuyExecution, InstructionV2 } from '@/chain/zeitgeist/types/v26';
import { V1MultiLocation, V2Instruction, V2Instruction_BuyExecution } from '@/chain/zeitgeist/types/v32';
import { V2Instruction as V2InstructionV34 } from '@/chain/zeitgeist/types/v34';
import { V3MultiLocation, V3Instruction, V3Instruction_BuyExecution } from '@/chain/zeitgeist/types/v49';
import { V1MultiLocation as V1MultiLocationV48, V2Instruction as V2InstructionV48 } from '@/chain/zeitgeist/types/v48';

export class SentEventPalletDecoder implements ISentEventPalletDecoder {
  decode(event: Event) {
    assert(event.call);
    const sent = events.polkadotXcm.sent;

    if (sent.v26.is(event)) {
      const [origin, destination, message] = sent.v26.decode(event);
      if (message.length <= 1) return;

      const from = getOriginCaller(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as InstructionV2_BuyExecution;
      return {
        from,
        toChain: getDestination(destination),
        amount: getAmountV1(message[0]),
        to: getTarget(message.at(-1)!, from),
        weightLimit: getWeightLimit(weightLimitMsg),
      };
    } else if (sent.v32.is(event)) {
      const [origin, destination, message] = sent.v32.decode(event);
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
    } else if (sent.v34.is(event)) {
      const [origin, destination, message] = sent.v34.decode(event);
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
    } else if (sent.v48.is(event)) {
      const [origin, destination, message] = sent.v48.decode(event);
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
    } else if (sent.v49.is(event)) {
      const [origin, destination, message] = sent.v49.decode(event);
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
    } else if (sent.v56.is(event)) {
      const { origin, destination, message, messageId } = sent.v56.decode(event);
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
    }

    throw new UnknownVersionError(sent);
  }
}

function getOriginCaller(origin: MultiLocation | V1MultiLocation | V3MultiLocation | V1MultiLocationV48) {
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

function getDestination(destination: MultiLocation | V1MultiLocation | V3MultiLocation | V1MultiLocationV48) {
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

function getAmount(message: V2Instruction | V3Instruction | V2InstructionV34 | V2InstructionV48) {
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

function getAmountV1(message: InstructionV2) {
  switch (message.__kind) {
    case 'WithdrawAsset':
    case 'ReserveAssetDeposited':
      return message.value[0].fungibility.__kind === 'Fungible' ? message.value[0].fungibility.value : undefined;
    case 'TransferReserveAsset':
      return message.assets[0].fungibility.__kind === 'Fungible' ? message.assets[0].fungibility.value : undefined;
    default:
      return;
  }
}

function getTarget(message: V2Instruction | V3Instruction | InstructionV2 | V2InstructionV34 | V2InstructionV48, from?: string) {
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

function getWeightLimit(message: InstructionV2_BuyExecution | V2Instruction_BuyExecution | undefined) {
  if (message?.weightLimit?.__kind === 'Limited') return message.weightLimit.value;
  else return;
}

function getWeightLimitV3V4(message: V3Instruction_BuyExecution | undefined) {
  if (message?.weightLimit?.__kind === 'Limited') return message.weightLimit.value.proofSize;
  else return;
}
