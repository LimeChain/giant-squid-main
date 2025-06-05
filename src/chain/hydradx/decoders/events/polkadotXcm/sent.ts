import { events } from '@/chain/hydradx/types';
import { UnknownVersionError } from '@/utils';
import { Event, ISentEventPalletDecoder } from '@/indexer';

import assert from 'assert';
import { V2Instruction_BuyExecution } from '@/chain/hydradx/types/v108';
import { V3Instruction_BuyExecution } from '@/chain/hydradx/types/v160';
import { V4Instruction_BuyExecution } from '@/chain/hydradx/types/v244';

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

    if (sent.v108.is(event)) {
      const [origin, destination, message] = sent.v108.decode(event);
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
    } else if (sent.v160.is(event)) {
      const [origin, destination, message] = sent.v160.decode(event);
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
    } else if (sent.v205.is(event)) {
      const { origin, destination, message, messageId } = sent.v205.decode(event);
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
    } else if (sent.v244.is(event)) {
      const { origin, destination, message, messageId } = sent.v244.decode(event);
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
