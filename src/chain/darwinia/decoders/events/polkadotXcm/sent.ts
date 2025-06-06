import { events } from '@/chain/darwinia/types';
import { UnknownVersionError } from '@/utils';
import { Event, ISentEventPalletDecoder } from '@/indexer';

import assert from 'assert';

import { V3Instruction_BuyExecution, V3Instruction_DepositAsset } from '@/chain/darwinia/types/v6100';
import { V4Instruction_BuyExecution, V4Instruction_DepositAsset } from '@/chain/darwinia/types/v6640';
import {
  getAssetAmount,
  getRawAssetFromInstruction,
  getTransferTarget,
  getTransferTargetV4,
  getOriginCaller,
  getDestination,
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

    if (sent.v6100.is(event)) {
      const [origin, destination, message] = sent.v6100.decode(event);
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
        toChain: getDestination(destination),
        amount: assetAmount,
        asset: rawAssets,
        weightLimit: getWeightLimitV3V4(weightLimitMsg),
        contractCalled: event?.call?.args?.transaction?.value?.action?.value,
        contractInput: event?.call?.args?.transaction?.value?.input,
      };
    } else if (sent.v6501.is(event)) {
      const { origin, destination, message, messageId } = sent.v6501.decode(event);
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
        to: transferTarget,
        toChain: getDestination(destination),
        amount: assetAmount,
        asset: rawAssets,
        weightLimit: getWeightLimitV3V4(weightLimitMsg),
        from,
        contractCalled: event?.call?.args?.transaction?.value?.action?.value,
        contractInput: event?.call?.args?.transaction?.value?.input,
      };
    } else if (sent.v6640.is(event)) {
      const { origin, destination, message, messageId } = sent.v6640.decode(event);
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
        to: transferTarget,
        toChain: getDestinationV4(destination),
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
