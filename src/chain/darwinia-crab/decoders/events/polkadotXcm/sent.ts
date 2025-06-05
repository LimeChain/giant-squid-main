import { events } from '@/chain/darwinia-crab/types';
import { UnknownVersionError } from '@/utils';
import { Event, ISentEventPalletDecoder } from '@/indexer';

import assert from 'assert';
import { V2Instruction_BuyExecution } from '@/chain/darwinia-crab/types/v6000';
import { V3Instruction_BuyExecution } from '@/chain/darwinia-crab/types/v6020';
import { V4Instruction_BuyExecution } from '@/chain/darwinia-crab/types/v6640';

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

    if (sent.v6000.is(event)) {
      const [origin, destination, message] = sent.v6000.decode(event);
      if (message.length <= 1) return;

      const from = getOriginCaller(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V2Instruction_BuyExecution;
      const transferTarget = getTransferTarget(message.at(-1)!, from.value);
      const assetAmount = getAssetAmount(message[0]);
      const rawAssets = getRawAssetFromInstruction(message[0]);

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
    } else if (sent.v6020.is(event)) {
      const [origin, destination, message] = sent.v6020.decode(event);
      if (message.length <= 1) return;

      const from = getOriginCaller(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V2Instruction_BuyExecution;
      const transferTarget = getTransferTarget(message.at(-1)!, from.value);
      const assetAmount = getAssetAmount(message[0]);
      const rawAssets = getRawAssetFromInstruction(message[0]);

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
    } else if (sent.v6501.is(event)) {
      const { origin, destination, message, messageId } = sent.v6501.decode(event);
      if (message.length <= 1) return;

      const from = getOriginCaller(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V3Instruction_BuyExecution;
      const transferTarget = getTransferTarget(message.at(-1)!, from.value);
      const assetAmount = getAssetAmount(message[0]);
      const rawAssets = getRawAssetFromInstruction(message[0]);

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
    } else if (sent.v6640.is(event)) {
      const { origin, destination, message, messageId } = sent.v6640.decode(event);
      if (message.length <= 1) return;

      const from = getOriginCallerV4(origin);
      if (!from) return;

      const weightLimitMsg = message.find((msg) => msg.__kind === 'BuyExecution') as V4Instruction_BuyExecution;
      const transferTarget = getTransferTargetV4(message.at(-1)!, from.value);
      const assetAmount = getAssetAmountV4(message[0]);
      const rawAssets = getRawAssetFromInstructionV4(message[0]);

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
