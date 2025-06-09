import { Event } from '@/indexer';
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
  IXcmSentEventPalletDecoder,
  SUPPORTED_ASSET_MESSAGE_TYPES,
} from '@/indexer/pallets/xcm/events/sent';
import { events } from '@/chain/polkadot/types';
import assert from 'assert';
import { V2Instruction_BuyExecution } from '@/chain/polkadot/types/v9140';
import { V3Instruction_BuyExecution } from '@/chain/polkadot/types/v9420';
import { V4Instruction_BuyExecution, V4Instruction_DepositAsset } from '@/chain/polkadot/types/v1002000';
import { V5Instruction_BuyExecution, V5Instruction_DepositAsset } from '@/chain/polkadot/types/v1005001';
import { UnknownVersionError } from '@/utils/errors';
import { V2Instruction_DepositAsset } from '@/chain/polkadot/types/v9170';
import { V3Instruction_DepositAsset } from '@/chain/polkadot/types/v9420';

export class XcmSentEventPalletDecoder implements IXcmSentEventPalletDecoder {
  decode(event: Event) {
    assert(event.call);
    const sent = events.xcmPallet.sent;

    if (sent.v9140.is(event)) {
      const [origin, destination, message] = sent.v9140.decode(event);
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
    } else if (sent.v9170.is(event)) {
      const [origin, destination, message] = sent.v9170.decode(event);
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
    } else if (sent.v9370.is(event)) {
      const [origin, destination, message] = sent.v9370.decode(event);
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
    } else if (sent.v9420.is(event)) {
      const [origin, destination, message] = sent.v9420.decode(event);
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
    } else if (sent.v1000001.is(event)) {
      const { origin, destination, message } = sent.v1000001.decode(event);
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
    } else if (sent.v1002000.is(event)) {
      const { origin, destination, message } = sent.v1002000.decode(event);
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
    } else if (sent.v1005001.is(event)) {
      const { origin, destination, message } = sent.v1005001.decode(event);
      if (message.length <= 1) return;

      const from = getOriginCallerV4(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V5Instruction_BuyExecution;
      const assetMsg = message.find((msg) => SUPPORTED_ASSET_MESSAGE_TYPES.includes(msg.__kind));
      const transferTargetMsg = message.find((msg) => msg.__kind === 'DepositAsset') as V5Instruction_DepositAsset;

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
