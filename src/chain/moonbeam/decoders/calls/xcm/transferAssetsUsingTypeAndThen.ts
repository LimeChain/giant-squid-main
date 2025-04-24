import { calls } from '@/chain/moonbeam/types';
import { Call } from '@/indexer';
import { UnknownVersionError } from '@/utils';
import {
  decodeV1ToV3Assets,
  decodeV1ToV3CustomXcmOnDest,
  decodeV1ToV3Dest,
  decodeV3WeightLimit,
  decodeV4Assets,
  decodeV4CustomXcmOnDest,
  decodeV4Dest,
} from './transfer';
import { ITransferAssetsUsingTypeAndThenPalletDecoder } from '@/indexer/pallets/xcm/calls/transferAssetsUsingTypeAndThen';

export class TransferAssetsUsingTypeAndThenCallDecoder implements ITransferAssetsUsingTypeAndThenPalletDecoder {
  decode(call: Call) {
    const { transferAssetsUsingTypeAndThen } = calls.polkadotXcm;
    let to: string = '';
    let toChain: string = '';
    let amount: bigint = 0n;
    // no `feeAssetItem` field in `transfer_assets_using_type_and_then` call -> use default value
    let feeAssetItem: number = 0;
    let weightLimit: bigint | null = null;

    if (transferAssetsUsingTypeAndThen.v3100.is(call)) {
      const data = transferAssetsUsingTypeAndThen.v3100.decode(call);

      const { assets: _assets, dest, weightLimit: _weightLimit, assetsTransferType, feesTransferType, remoteFeesId, customXcmOnDest } = data;
      weightLimit = decodeV3WeightLimit(_weightLimit).limit;

      // Destination mapping
      switch (dest.__kind) {
        case 'V2':
        case 'V3': {
          const { parachainDestination } = decodeV1ToV3Dest(dest);
          toChain = parachainDestination;
          break;
        }

        case 'V4':
          const { parachainDestination } = decodeV4Dest(dest);
          toChain = parachainDestination;
          break;
      }

      // XcmOnDest mapping
      switch (customXcmOnDest.__kind) {
        case 'V2':
        case 'V3': {
          const { beneficiaryKey } = decodeV1ToV3CustomXcmOnDest(customXcmOnDest);
          to = beneficiaryKey;
          break;
        }
        case 'V4': {
          const { beneficiaryKey } = decodeV4CustomXcmOnDest(customXcmOnDest);
          to = beneficiaryKey;
          break;
        }
      }

      // Assets mapping
      switch (_assets.__kind) {
        case 'V2':
        case 'V3': {
          const { amount: _amount } = decodeV1ToV3Assets(_assets);
          amount = _amount;
          break;
        }
        case 'V4': {
          const { amount: _amount } = decodeV4Assets(_assets);
          amount = _amount;
          break;
        }
      }
    } else {
      throw new UnknownVersionError(transferAssetsUsingTypeAndThen);
    }

    return { feeAssetItem, amount, to, toChain, weightLimit };
  }
}
