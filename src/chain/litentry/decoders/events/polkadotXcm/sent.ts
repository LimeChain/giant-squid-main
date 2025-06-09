import { events } from '@/chain/litentry/types';
import { UnknownVersionError } from '@/utils';
import { Event, ISentEventPalletDecoder } from '@/indexer';

import assert from 'assert';
import { V2Instruction_BuyExecution, V2Instruction_DepositAsset } from '@/chain/litentry/types/v9000';
import { V3Instruction_BuyExecution, V3Instruction_DepositAsset } from '@/chain/litentry/types/v9168';
import { V4Instruction_BuyExecution, V4Instruction_DepositAsset } from '@/chain/litentry/types/v9210';

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

    if (sent.v9000.is(event)) {
      const [origin, destination, message] = sent.v9000.decode(event);
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
    } else if (sent.v9071.is(event)) {
      const [origin, destination, message] = sent.v9071.decode(event);
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
    } else if (sent.v9150.is(event)) {
      const [origin, destination, message] = sent.v9150.decode(event);
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
    } else if (sent.v9168.is(event)) {
      const [origin, destination, message] = sent.v9168.decode(event);
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
    } else if (sent.v9200.is(event)) {
      const { origin, destination, message, messageId } = sent.v9200.decode(event);
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
    } else if (sent.v9210.is(event)) {
      const { origin, destination, message, messageId } = sent.v9210.decode(event);
      if (message.length <= 1) return;

      const from = getOriginCallerV4(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V4Instruction_BuyExecution;
      const assetMsg = message.find((msg) => SUPPORTED_ASSET_MESSAGE_TYPES.includes(msg.__kind));
      const transferTargetMsg = message.find((msg) => msg.__kind === 'DepositAsset') as V4Instruction_DepositAsset;

      const transferTarget = getTransferTargetV4(transferTargetMsg, from.value);
      const assetAmount = getAssetAmountV4(assetMsg);
      const rawAssets = getRawAssetFromInstructionV4(assetMsg);

      return {
        from,
        to: transferTarget,
        toChain: getDestinationV4(destination, transferTarget.value),
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
