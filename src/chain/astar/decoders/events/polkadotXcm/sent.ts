import { events } from '@/chain/astar/types';
import { UnknownVersionError } from '@/utils';
import { Event, ISentEventPalletDecoder } from '@/indexer';

import assert from 'assert';
import { V2Instruction_BuyExecution } from '@/chain/astar/types/v15';
import { V2Instruction_BuyExecution as V2Instruction_BuyExecutionV52 } from '@/chain/astar/types/v52';
import { V3Instruction_BuyExecution } from '@/chain/astar/types/v61';
import { V4Instruction_BuyExecution } from '@/chain/astar/types/v91';
import { V5Instruction_BuyExecution } from '@/chain/astar/types/v1501';
import {
  getAssetAmount,
  getRawAssetFromInstruction,
  getTransferTarget,
  getTransferTargetV4,
  getOriginCaller,
  getDestination,
  getWeightLimit,
  getWeightLimitV3V4,
  getDestinationV4,
  getOriginCallerV4,
  getAssetAmountV4,
  getRawAssetFromInstructionV4,
} from '@/indexer/pallets/polkadot-xcm/events/sent';

export class SentEventPalletDecoder implements ISentEventPalletDecoder {
  decode(event: Event) {
    assert(event.call);
    const sent = events.polkadotXcm.sent;

    if (sent.v15.is(event)) {
      const [origin, destination, message] = sent.v15.decode(event);
      if (message.length <= 1) return;

      const from = getOriginCaller(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V2Instruction_BuyExecution;
      const transferTarget = getTransferTarget(message.at(-1)!, from.value);
      const assetAmount = getAssetAmount(message[0]);
      const rawAssets = getRawAssetFromInstruction(message[0]);

      return {
        from,
        to: transferTarget,
        toChain: getDestination(destination, transferTarget.value),
        amount: assetAmount,
        asset: rawAssets,
        weightLimit: getWeightLimit(weightLimitMsg),
        contractCalled: event?.call?.args?.transaction?.value?.action?.value,
        contractInput: event?.call?.args?.transaction?.value?.input,
      };
    } else if (sent.v52.is(event)) {
      const [origin, destination, message] = sent.v52.decode(event);
      if (message.length <= 1) return;

      const from = getOriginCaller(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V2Instruction_BuyExecutionV52;
      const transferTarget = getTransferTarget(message.at(-1)!, from.value);
      const assetAmount = getAssetAmount(message[0]);
      const rawAssets = getRawAssetFromInstruction(message[0]);

      return {
        to: transferTarget,
        toChain: getDestination(destination, transferTarget.value),
        amount: assetAmount,
        asset: rawAssets,
        weightLimit: getWeightLimit(weightLimitMsg),
        from,
        contractCalled: event?.call?.args?.transaction?.value?.action?.value,
        contractInput: event?.call?.args?.transaction?.value?.input,
      };
    } else if (sent.v61.is(event)) {
      const [origin, destination, message] = sent.v61.decode(event);
      if (message.length <= 1) return;

      const from = getOriginCaller(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V3Instruction_BuyExecution;
      const transferTarget = getTransferTarget(message.at(-1)!, from.value);
      const assetAmount = getAssetAmount(message[0]);
      const rawAssets = getRawAssetFromInstruction(message[0]);

      return {
        to: transferTarget,
        toChain: getDestination(destination, transferTarget.value),
        amount: assetAmount,
        asset: rawAssets,
        weightLimit: getWeightLimitV3V4(weightLimitMsg),
        from,
        contractCalled: event?.call?.args?.transaction?.value?.action?.value,
        contractInput: event?.call?.args?.transaction?.value?.input,
      };
    } else if (sent.v82.is(event)) {
      const { origin, destination, message, messageId } = sent.v82.decode(event);
      if (message.length <= 1) return;

      const from = getOriginCaller(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V3Instruction_BuyExecution;
      const transferTarget = getTransferTarget(message.at(-1)!, from.value);
      const assetAmount = getAssetAmount(message[0]);
      const rawAssets = getRawAssetFromInstruction(message[0]);

      return {
        to: transferTarget,
        toChain: getDestination(destination, transferTarget.value),
        amount: assetAmount,
        asset: rawAssets,
        weightLimit: getWeightLimitV3V4(weightLimitMsg),
        from,
        contractCalled: event?.call?.args?.transaction?.value?.action?.value,
        contractInput: event?.call?.args?.transaction?.value?.input,
      };
    } else if (sent.v91.is(event)) {
      const { origin, destination, message, messageId } = sent.v91.decode(event);
      if (message.length <= 1) return;

      const from = getOriginCallerV4(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V4Instruction_BuyExecution;
      const transferTarget = getTransferTargetV4(message.at(-1)!, from.value);
      const assetAmount = getAssetAmountV4(message[0]);
      const rawAssets = getRawAssetFromInstructionV4(message[0]);

      return {
        to: transferTarget,
        toChain: getDestinationV4(destination, transferTarget.value),
        amount: assetAmount,
        asset: rawAssets,
        weightLimit: getWeightLimitV3V4(weightLimitMsg),
        from,
        contractCalled: event?.call?.args?.transaction?.value?.action?.value,
        contractInput: event?.call?.args?.transaction?.value?.input,
      };
    } else if (sent.v1501.is(event)) {
      const { origin, destination, message, messageId } = sent.v1501.decode(event);
      if (message.length <= 1) return;

      const from = getOriginCallerV4(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V5Instruction_BuyExecution;
      const transferTarget = getTransferTargetV4(message.at(-1)!, from.value);
      const assetAmount = getAssetAmountV4(message[0]);
      const rawAssets = getRawAssetFromInstructionV4(message[0]);

      return {
        to: transferTarget,
        toChain: getDestinationV4(destination, transferTarget.value),
        amount: assetAmount,
        asset: rawAssets,
        weightLimit: getWeightLimitV3V4(weightLimitMsg),
        from,
        contractCalled: event?.call?.args?.transaction?.value?.action?.value,
        contractInput: event?.call?.args?.transaction?.value?.input,
      };
    }

    throw new UnknownVersionError(sent);
  }
}
