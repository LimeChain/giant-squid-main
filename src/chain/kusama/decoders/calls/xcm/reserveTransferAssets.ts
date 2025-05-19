import { calls } from '@/chain/kusama/types';
import { Call } from '@/indexer';
import { IReserveTransferAssetsPalletDecoder } from '@/indexer/pallets/xcm/calls/reserveTransferAssets';
import { UnknownVersionError } from '@/utils';
import {
  decodedV1ToV2Asssets,
  decodeV0Assets,
  decodeV0Beneficiary,
  decodeV0Dest,
  decodeV1ToV3Assets,
  decodeV1ToV3Beneficiary,
  decodeV1ToV3Dest,
  decodeV4Assets,
  decodeV4Beneficiary,
  decodeV4Dest,
  decodeX1Dest,
} from './transfer';

export class ReserveTransferAssetsCallDecoder implements IReserveTransferAssetsPalletDecoder {
  decode(call: Call) {
    const { reserveTransferAssets } = calls.xcmPallet;
    let to: string = '';
    let toChain: string = '';
    let amount: bigint = 0n;
    let feeAssetItem: number = 0;

    if (reserveTransferAssets.v9030.is(call)) {
      const data = reserveTransferAssets.v9030.decode(call);

      const { assets: _assets, beneficiary: _beneficiary, dest } = data;

      // Destination mapping
      switch (dest.__kind) {
        case 'X1': {
          const { parachainDestination } = decodeX1Dest(dest);
          toChain = parachainDestination;
          break;
        }
      }

      // Beneficiary mapping
      switch (_beneficiary.__kind) {
        case 'X1': {
          switch (_beneficiary.value.__kind) {
            case 'AccountId32':
              to = _beneficiary.value.id;
              break;
            case 'AccountIndex64':
              to = _beneficiary.value.index.toString();
              break;
            case 'AccountKey20':
              to = _beneficiary.value.key;
              break;
          }
          break;
        }
      }

      // Assets mapping
      switch (_assets[0].__kind) {
        case 'ConcreteFungible': {
          amount = _assets[0].amount;
          break;
        }
      }
    } else if (reserveTransferAssets.v9100.is(call)) {
      const data = reserveTransferAssets.v9100.decode(call);

      const { assets: _assets, beneficiary: _beneficiary, feeAssetItem: _fee, dest } = data;
      feeAssetItem = _fee;

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
          const { amount: _amount } = decodedV1ToV2Asssets(_assets);
          amount = _amount;
          break;
        }
      }
    } else if (reserveTransferAssets.v9111.is(call)) {
      const data = reserveTransferAssets.v9111.decode(call);

      const { assets: _assets, beneficiary: _beneficiary, feeAssetItem: _fee, dest } = data;
      feeAssetItem = _fee;

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
    } else if (reserveTransferAssets.v9370.is(call)) {
      const data = reserveTransferAssets.v9370.decode(call);

      const { assets: _assets, beneficiary: _beneficiary, feeAssetItem: _fee, dest } = data;
      feeAssetItem = _fee;

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
    } else if (reserveTransferAssets.v9381.is(call)) {
      const data = reserveTransferAssets.v9381.decode(call);

      const { assets: _assets, beneficiary: _beneficiary, feeAssetItem: _fee, dest } = data;
      feeAssetItem = _fee;

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
    } else if (reserveTransferAssets.v1002000.is(call)) {
      const data = reserveTransferAssets.v1002000.decode(call);

      const { assets: _assets, beneficiary: _beneficiary, feeAssetItem: _fee, dest } = data;
      feeAssetItem = _fee;

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
    } else if (reserveTransferAssets.v1005000.is(call)) {
      const data = reserveTransferAssets.v1005000.decode(call);

      const { assets: _assets, beneficiary: _beneficiary, feeAssetItem: _fee, dest } = data;
      feeAssetItem = _fee;

      // Destination mapping
      switch (dest.__kind) {
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
      throw new UnknownVersionError(reserveTransferAssets);
    }

    return { feeAssetItem, amount, to, toChain };
  }
}
