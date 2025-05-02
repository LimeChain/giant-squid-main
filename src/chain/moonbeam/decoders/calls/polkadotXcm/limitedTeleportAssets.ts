import { calls } from '@/chain/moonbeam/types';
import { Call } from '@/indexer';
import { UnknownVersionError } from '@/utils';
import { ILimitedTeleportAssetsPalletDecoder } from '@/indexer/pallets/xcm/calls/limitedTeleportAssets';
import {
  decodeV0Assets,
  decodeV0Beneficiary,
  decodeV0Dest,
  decodeV1ToV3Assets,
  decodeV1ToV3Beneficiary,
  decodeV1ToV3Dest,
  decodeV2WeightLimit,
  decodeV3WeightLimit,
  decodeV4Assets,
  decodeV4Beneficiary,
  decodeV4Dest,
} from './transfer';

export class LimitedTeleportAssetsCallDecoder implements ILimitedTeleportAssetsPalletDecoder {
  decode(call: Call) {
    const { limitedTeleportAssets } = calls.polkadotXcm;
    let to: string = '';
    let toChain: string = '';
    let amount: bigint = 0n;
    let feeAssetItem: number = 0;
    let weightLimit: bigint | null = null;

    if (limitedTeleportAssets.v1201.is(call)) {
      const data = limitedTeleportAssets.v1201.decode(call);

      const { assets: _assets, beneficiary: _beneficiary, feeAssetItem: _fee, dest, weightLimit: _weightLimit } = data;
      feeAssetItem = _fee;
      weightLimit = decodeV2WeightLimit(_weightLimit).limit;

      // Destination mapping
      switch (dest.__kind) {
        case 'V0': {
          const { parachainDestination } = decodeV0Dest(dest);
          toChain = parachainDestination;
          break;
        }

        case 'V1': {
          const { parachainDestination } = decodeV1ToV3Dest(dest);
          toChain = parachainDestination;
          break;
        }
      }

      // Beneficiary mapping
      switch (_beneficiary.__kind) {
        case 'V0': {
          const { beneficiaryKey } = decodeV0Beneficiary(_beneficiary);
          to = beneficiaryKey;
          break;
        }
        case 'V1': {
          const { beneficiaryKey } = decodeV1ToV3Beneficiary(_beneficiary);
          to = beneficiaryKey;
          break;
        }
      }

      // Assets mapping
      switch (_assets.__kind) {
        case 'V0': {
          const { amount: _amount } = decodeV0Assets(_assets);
          amount = _amount;
          break;
        }
        case 'V1': {
          const { amount: _amount } = decodeV1ToV3Assets(_assets);
          amount = _amount;
          break;
        }
      }
    } else if (limitedTeleportAssets.v2201.is(call)) {
      const data = limitedTeleportAssets.v2201.decode(call);

      const { assets: _assets, beneficiary: _beneficiary, feeAssetItem: _fee, dest, weightLimit: _weightLimit } = data;
      feeAssetItem = _fee;
      weightLimit = decodeV2WeightLimit(_weightLimit).limit;

      // Destination mapping
      switch (dest.__kind) {
        case 'V0': {
          const { parachainDestination } = decodeV0Dest(dest);
          toChain = parachainDestination;
          break;
        }

        case 'V1': {
          const { parachainDestination } = decodeV1ToV3Dest(dest);
          toChain = parachainDestination;
          break;
        }
      }

      // Beneficiary mapping
      switch (_beneficiary.__kind) {
        case 'V0': {
          const { beneficiaryKey } = decodeV0Beneficiary(_beneficiary);
          to = beneficiaryKey;
          break;
        }
        case 'V1': {
          const { beneficiaryKey } = decodeV1ToV3Beneficiary(_beneficiary);
          to = beneficiaryKey;
          break;
        }
      }

      // Assets mapping
      switch (_assets.__kind) {
        case 'V0': {
          const { amount: _amount } = decodeV0Assets(_assets);
          amount = _amount;
          break;
        }
        case 'V1': {
          const { amount: _amount } = decodeV1ToV3Assets(_assets);
          amount = _amount;
          break;
        }
      }
    } else if (limitedTeleportAssets.v2302.is(call)) {
      const data = limitedTeleportAssets.v2302.decode(call);

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
      }

      // Beneficiary mapping
      switch (_beneficiary.__kind) {
        case 'V2':
        case 'V3': {
          const { beneficiaryKey } = decodeV1ToV3Beneficiary(_beneficiary);
          to = beneficiaryKey;
          break;
        }
      }

      // Assets mapping
      switch (_assets.__kind) {
        case 'V2':
        case 'V3':
          const { amount: _amount } = decodeV1ToV3Assets(_assets);
          amount = _amount;
          break;
      }
    } else if (limitedTeleportAssets.v2901.is(call)) {
      const data = limitedTeleportAssets.v2901.decode(call);

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
      throw new UnknownVersionError(limitedTeleportAssets);
    }

    return { feeAssetItem, amount, to, toChain, weightLimit };
  }
}
