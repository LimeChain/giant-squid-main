import { events } from '@/chain/subsocial/types';
import { UnknownVersionError } from '@/utils';
import { Event, ISentEventPalletDecoder } from '@/indexer';

import assert from 'assert';
import { V2Instruction_BuyExecution, V2Instruction_DepositAsset } from '@/chain/subsocial/types/v1';
import { V3Instruction_BuyExecution, V3Instruction_DepositAsset } from '@/chain/subsocial/types/v32';
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
  SUPPORTED_ASSET_MESSAGE_TYPES,
} from '@/indexer/pallets/polkadot-xcm/events/sent';

export class SentEventPalletDecoder implements ISentEventPalletDecoder {
  decode(event: Event) {
    assert(event.call);
    const sent = events.polkadotXcm.sent;

    if (sent.v1.is(event)) {
      const [origin, destination, message] = sent.v1.decode(event);
      if (message.length <= 1) return;

      const from = getOriginCaller(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V2Instruction_BuyExecution;
      const assetMsg = message.find((msg) => SUPPORTED_ASSET_MESSAGE_TYPES.includes(msg.__kind));
      const transferTargetMsg = message.find((msg) => msg.__kind === 'DepositAsset') as V2Instruction_DepositAsset;

      const transferTarget = getTransferTarget(transferTargetMsg, from.value);
      const assetAmount = getAssetAmount(assetMsg);
      const rawAssets = getRawAssetFromInstruction(assetMsg);

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
    } else if (sent.v5.is(event)) {
      const [origin, destination, message] = sent.v5.decode(event);
      if (message.length <= 1) return;

      const from = getOriginCaller(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V2Instruction_BuyExecution;
      const assetMsg = message.find((msg) => SUPPORTED_ASSET_MESSAGE_TYPES.includes(msg.__kind));
      const transferTargetMsg = message.find((msg) => msg.__kind === 'DepositAsset') as V2Instruction_DepositAsset;

      const transferTarget = getTransferTarget(transferTargetMsg, from.value);
      const assetAmount = getAssetAmount(assetMsg);
      const rawAssets = getRawAssetFromInstruction(assetMsg);

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
    } else if (sent.v20.is(event)) {
      const [origin, destination, message] = sent.v20.decode(event);
      if (message.length <= 1) return;

      const from = getOriginCaller(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V2Instruction_BuyExecution;
      const assetMsg = message.find((msg) => SUPPORTED_ASSET_MESSAGE_TYPES.includes(msg.__kind));
      const transferTargetMsg = message.find((msg) => msg.__kind === 'DepositAsset') as V2Instruction_DepositAsset;

      const transferTarget = getTransferTarget(transferTargetMsg, from.value);
      const assetAmount = getAssetAmount(assetMsg);
      const rawAssets = getRawAssetFromInstruction(assetMsg);

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
    } else if (sent.v32.is(event)) {
      const [origin, destination, message] = sent.v32.decode(event);
      if (message.length <= 1) return;

      const from = getOriginCaller(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V3Instruction_BuyExecution;
      const assetMsg = message.find((msg) => SUPPORTED_ASSET_MESSAGE_TYPES.includes(msg.__kind));
      const transferTargetMsg = message.find((msg) => msg.__kind === 'DepositAsset') as V3Instruction_DepositAsset;

      const transferTarget = getTransferTarget(transferTargetMsg, from.value);
      const assetAmount = getAssetAmount(assetMsg);
      const rawAssets = getRawAssetFromInstruction(assetMsg);

      return {
        from,
        to: transferTarget,
        toChain: getDestination(destination, transferTarget.value),
        amount: assetAmount,
        asset: rawAssets,
        weightLimit: getWeightLimitV3V4(weightLimitMsg),
        contractCalled: event?.call?.args?.transaction?.value?.action?.value,
        contractInput: event?.call?.args?.transaction?.value?.input,
      };
    } else if (sent.v45.is(event)) {
      const { origin, destination, message, messageId } = sent.v45.decode(event);
      if (message.length <= 1) return;

      const from = getOriginCaller(origin);
      if (!from) return;
      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V3Instruction_BuyExecution;
      const assetMsg = message.find((msg) => SUPPORTED_ASSET_MESSAGE_TYPES.includes(msg.__kind));
      const transferTargetMsg = message.find((msg) => msg.__kind === 'DepositAsset') as V3Instruction_DepositAsset;

      const transferTarget = getTransferTarget(transferTargetMsg, from.value);
      const assetAmount = getAssetAmount(assetMsg);
      const rawAssets = getRawAssetFromInstruction(assetMsg);

      return {
        from,
        to: transferTarget,
        toChain: getDestination(destination, transferTarget.value),
        amount: assetAmount,
        asset: rawAssets,
        weightLimit: getWeightLimitV3V4(weightLimitMsg),
        contractCalled: event?.call?.args?.transaction?.value?.action?.value,
        contractInput: event?.call?.args?.transaction?.value?.input,
      };
    }

    throw new UnknownVersionError(sent);
  }
}
