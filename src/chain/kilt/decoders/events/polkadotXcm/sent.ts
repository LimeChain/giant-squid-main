import { events } from '@/chain/kilt/types';
import { UnknownVersionError } from '@/utils';
import { Event, ISentEventPalletDecoder } from '@/indexer';

import assert from 'assert';
import { V2Instruction_BuyExecution } from '@/chain/kilt/types/v10710';
import { V3Instruction_BuyExecution } from '@/chain/kilt/types/v11000';
import { V4Instruction_BuyExecution } from '@/chain/kilt/types/v11401';
import {
  getOriginCaller,
  getDestination,
  getAssetAmount,
  getAssetAmountV4,
  getTransferTarget,
  getTransferTargetV4,
  getWeightLimit,
  getWeightLimitV3V4,
  getDestinationV4,
  getOriginCallerV4,
  getRawAssetFromInstructionV4,
  getRawAssetFromInstruction,
} from '@/indexer/pallets/polkadot-xcm/events/sent';

export class SentEventPalletDecoder implements ISentEventPalletDecoder {
  decode(event: Event) {
    assert(event.call);
    const sent = events.polkadotXcm.sent;

    if (sent.v10710.is(event)) {
      const [origin, destination, message] = sent.v10710.decode(event);
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
    } else if (sent.v10890.is(event)) {
      const [origin, destination, message] = sent.v10890.decode(event);
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
      };
    } else if (sent.v11000.is(event)) {
      const [origin, destination, message] = sent.v11000.decode(event);
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
    } else if (sent.v11210.is(event)) {
      const { origin, destination, message, messageId } = sent.v11210.decode(event);
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
    } else if (sent.v11401.is(event)) {
      const { origin, destination, message, messageId } = sent.v11401.decode(event);
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
    }

    throw new UnknownVersionError(sent);
  }
}
