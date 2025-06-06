import { events } from '@/chain/integritee/types';
import { UnknownVersionError } from '@/utils';
import { Event, ISentEventPalletDecoder } from '@/indexer';

import assert from 'assert';
import { V2Instruction_BuyExecution, V2Instruction_DepositAsset } from '@/chain/integritee/types/integriteeParachainV14';
import { V3Instruction_BuyExecution, V3Instruction_DepositAsset } from '@/chain/integritee/types/integriteeParachainV35';
import { V4Instruction_BuyExecution, V4Instruction_DepositAsset } from '@/chain/integritee/types/integriteeParachainV520';

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

    if (sent.integriteeParachainV14.is(event)) {
      const [origin, destination, message] = sent.integriteeParachainV14.decode(event);
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
        toChain: getDestination(destination),
        amount: assetAmount,
        to: transferTarget,
        weightLimit: getWeightLimit(weightLimitMsg),
        asset: rawAssets,
        contractCalled: event?.call?.args?.transaction?.value?.action?.value,
        contractInput: event?.call?.args?.transaction?.value?.input,
      };
    } else if (sent.integriteeParachainV35.is(event)) {
      const [origin, destination, message] = sent.integriteeParachainV35.decode(event);
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
        toChain: getDestination(destination),
        amount: assetAmount,
        to: transferTarget,
        weightLimit: getWeightLimitV3V4(weightLimitMsg),
        asset: rawAssets,
        contractCalled: event?.call?.args?.transaction?.value?.action?.value,
        contractInput: event?.call?.args?.transaction?.value?.input,
      };
    } else if (sent.integriteeParachainV42.is(event)) {
      const { origin, destination, message, messageId } = sent.integriteeParachainV42.decode(event);
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
        toChain: getDestination(destination),
        amount: assetAmount,
        to: transferTarget,
        weightLimit: getWeightLimitV3V4(weightLimitMsg),
        asset: rawAssets,
        contractCalled: event?.call?.args?.transaction?.value?.action?.value,
        contractInput: event?.call?.args?.transaction?.value?.input,
      };
    } else if (sent.integriteeParachainV520.is(event)) {
      const { origin, destination, message, messageId } = sent.integriteeParachainV520.decode(event);
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
        toChain: getDestinationV4(destination),
        amount: assetAmount,
        to: transferTarget,
        weightLimit: getWeightLimitV3V4(weightLimitMsg),
        asset: rawAssets,
        contractCalled: event?.call?.args?.transaction?.value?.action?.value,
        contractInput: event?.call?.args?.transaction?.value?.input,
      };
    }

    throw new UnknownVersionError(sent);
  }
}
