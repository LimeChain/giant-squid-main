import { calls } from '@/chain/moonbeam/types';
import { Call } from '@/indexer';
import { IReserveTransferAssetsPalletDecoder } from '@/indexer/pallets/xcm/calls/reserveTransferAssets';
import { UnknownVersionError } from '@/utils';
import {
  decodeV0Assets,
  decodeV0Beneficiary,
  decodeV0Dest,
  decodeV1ToV3Assets,
  decodeV1ToV3Beneficiary,
  decodeV1ToV3Dest,
  decodeV4Assets,
  decodeV4Beneficiary,
  decodeV4Dest,
} from './transfer';

export class ReserveTransferAssetsCallDecoder implements IReserveTransferAssetsPalletDecoder {
  decode(call: Call) {
    const { reserveTransferAssets } = calls.polkadotXcm;
    let to: string = '';
    let toChain: string = '';
    let amount: bigint = 0n;
    let feeAssetItem: number = 0;

    if (reserveTransferAssets.v1201.is(call)) {
      const data = reserveTransferAssets.v1201.decode(call);

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
    } else if (reserveTransferAssets.v2201.is(call)) {
      const data = reserveTransferAssets.v2201.decode(call);

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
    } else if (reserveTransferAssets.v2302.is(call)) {
      const data = reserveTransferAssets.v2302.decode(call);

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
    } else if (reserveTransferAssets.v2901.is(call)) {
      const data = reserveTransferAssets.v2901.decode(call);

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
    } else {
      throw new UnknownVersionError(reserveTransferAssets);
    }

    return { feeAssetItem, amount, to, toChain };
  }
}
