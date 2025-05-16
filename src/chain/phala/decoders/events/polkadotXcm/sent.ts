import { events } from '@/chain/phala/types';
import { UnknownVersionError } from '@/utils';
import { Event, ISentEventPalletDecoder } from '@/indexer';

import assert from 'assert';
import { V1MultiLocation, V2Instruction, V2Instruction_BuyExecution } from '@/chain/phala/types/v1160';
import { V3MultiLocation, V3Instruction, V3Instruction_BuyExecution } from '@/chain/phala/types/v1260';
import { V3MultiLocation as V3MultiLocationV20, V3Instruction as V3InstructionV20 } from '@/chain/phala/types/v1260';

export class SentEventPalletDecoder implements ISentEventPalletDecoder {
  decode(event: Event) {
    assert(event.call);
    const sent = events.polkadotXcm.sent;

    if (sent.v1160.is(event)) {
      const [origin, destination, message] = sent.v1160.decode(event);
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
    } else if (sent.v1221.is(event)) {
      const [origin, destination, message] = sent.v1221.decode(event);
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
    } else if (sent.v1260.is(event)) {
      const { origin, destination, message, messageId } = sent.v1260.decode(event);
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

function getOriginCaller(origin: V1MultiLocation | V3MultiLocationV20 | V3MultiLocation) {
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

function getDestination(destination: V1MultiLocation | V3MultiLocation | V3MultiLocationV20) {
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

function getAmount(message: V2Instruction | V3Instruction | V3InstructionV20) {
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

function getTarget(message: V2Instruction | V3Instruction | V3InstructionV20, from?: string) {
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

function getWeightLimit(message: V2Instruction_BuyExecution | undefined) {
  if (message?.weightLimit?.__kind === 'Limited') return message.weightLimit.value;
  else return;
}

function getWeightLimitV3V4(message: V3Instruction_BuyExecution | undefined) {
  if (message?.weightLimit?.__kind === 'Limited') return message.weightLimit.value.proofSize;
  else return;
}
