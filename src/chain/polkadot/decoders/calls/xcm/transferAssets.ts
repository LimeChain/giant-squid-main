import { calls } from '@/chain/polkadot/types';
import { Call } from '@/indexer';
import { UnknownVersionError } from '@/utils';
import {
  decodeV1ToV3Assets,
  decodeV1ToV3Beneficiary,
  decodeV1ToV3Dest,
  decodeV3WeightLimit,
  decodeV4Assets,
  decodeV4Beneficiary,
  decodeV4Dest,
} from './transfer';
import { ITransferAssetsPalletDecoder } from '@/indexer/pallets/xcm/calls/transferAssets';

export class TransferAssetsCallDecoder implements ITransferAssetsPalletDecoder {
  decode(call: Call) {
    const { transferAssets } = calls.xcmPallet;
    let to: string = '';
    let toChain: string = '';
    let amount: bigint = 0n;
    let feeAssetItem: number = 0;
    let weightLimit: bigint | null = null;

    if (transferAssets.v1002000.is(call)) {
      const data = transferAssets.v1002000.decode(call);

      const { assets: _assets, beneficiary: _beneficiary, feeAssetItem: _fee, dest, weightLimit: _weightLimit } = data;
      feeAssetItem = _fee;
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

      // Beneficiary mapping
      switch (_beneficiary.__kind) {
        case 'V2':
        case 'V3': {
          const { beneficiaryKey } = decodeV1ToV3Beneficiary(_beneficiary);
          to = beneficiaryKey;
          break;
        }

        case 'V4':
          const { beneficiaryKey } = decodeV4Beneficiary(_beneficiary);
          to = beneficiaryKey;
          break;
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
      throw new UnknownVersionError(transferAssets);
    }

    return { feeAssetItem, amount, to, toChain, weightLimit };
  }
}
