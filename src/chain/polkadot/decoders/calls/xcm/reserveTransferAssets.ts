import { calls } from '@/chain/polkadot/types';
import {
  VersionedMultiAssets_V0 as VersionedMultiAssets_V0_V9140,
  VersionedMultiAssets_V1 as VersionedMultiAssets_V1_V9140,
  VersionedMultiLocation_V0 as VersionedMultiLocation_V0_V9140,
  VersionedMultiLocation_V1 as VersionedMultiLocation_V1_V9140,
} from '@/chain/polkadot/types/v9140';
import {
  VersionedMultiAssets_V0 as asVersionedMultiAssets_V0_V9370,
  VersionedMultiAssets_V1 as asVersionedMultiAssets_V1_V9370,
  VersionedMultiLocation_V0 as VersionedMultiLocation_V0_V9370,
  VersionedMultiLocation_V1 as VersionedMultiLocation_V1_V9370,
} from '@/chain/polkadot/types/v9370';
import {
  VersionedMultiAssets_V2 as VersionedMultiAssets_V2_V9420,
  VersionedMultiAssets_V3 as VersionedMultiAssets_V3_V9420,
  VersionedMultiLocation_V2 as VersionedMultiLocation_V2_V9420,
  VersionedMultiLocation_V3 as VersionedMultiLocation_V3_V9420,
} from '@/chain/polkadot/types/v9420';
import {
  VersionedAssets_V2 as VersionedAssets_V2_V100200,
  VersionedAssets_V3 as VersionedAssets_V3_V100200,
  VersionedLocation_V2 as VersionedLocation_V2_V100200,
  VersionedLocation_V3 as VersionedLocation_V3_V100200,
} from '@/chain/polkadot/types/v1002000';
import { Call } from '@/indexer';
import { IReserveTransferAssetsPalletDecoder } from '@/indexer/pallets/xcm/calls/reserveTransferAssets';
import { UnknownVersionError } from '@/utils';
import path from 'path';
import os from 'os';
import fs from 'fs';

const WRITE = false;
const filePath = path.join(os.homedir(), 'Desktop', 'xcm_reserve_transfer_early.json');
const fileStream = fs.createWriteStream(filePath, { flags: 'a' });
// if (WRITE) {
//   fileStream.write('[\n');

//   process.on('beforeExit', () => {
//     fileStream.write('\n]');
//     fileStream.end();
//   });
// }

function write(data: object) {
  fileStream.write(
    JSON.stringify(
      data,
      (key, value) => {
        if (typeof value === 'bigint') {
          return value.toString();
        }
        return value;
      },
      2
    )
  );
  fileStream.write(',\n');
}

export class ReserveTransferAssetsCallDecoder implements IReserveTransferAssetsPalletDecoder {
  decode(call: Call) {
    const { reserveTransferAssets } = calls.xcmPallet;
    let to: string = '';
    let toChain: string = '';
    let amount: bigint = 0n;
    let feeAssetItem: number = 0;

    if (reserveTransferAssets.v9140.is(call)) {
      const data = reserveTransferAssets.v9140.decode(call);
      if (WRITE) write({ extrinsicHash: call.extrinsic?.hash, ...data });

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
      if (WRITE) write({ extrinsicHash: call.extrinsic?.hash, ...data });

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
    } else if (reserveTransferAssets.v9420.is(call)) {
      const data = reserveTransferAssets.v9420.decode(call);
      if (WRITE) write({ extrinsicHash: call.extrinsic?.hash, ...data });

      const { assets: _assets, beneficiary: _beneficiary, feeAssetItem: _fee, dest } = data;
      feeAssetItem = _fee;

      // Destination mapping
      switch (dest.__kind) {
        case 'V2':
        case 'V3': {
          const { parachainDestination } = decodeV1ToV3Dest(dest);
          to = parachainDestination;
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
      if (WRITE) write({ extrinsicHash: call.extrinsic?.hash, ...data });

      const { assets: _assets, beneficiary: _beneficiary, feeAssetItem: _fee, dest } = data;
      feeAssetItem = _fee;

      // Destination mapping
      switch (dest.__kind) {
        case 'V2':
        case 'V3': {
          const { parachainDestination } = decodeV1ToV3Dest(dest);
          to = parachainDestination;
          break;
        }

        case 'V4':
          // most common occuranace of V4 type calls = X1 + Parachain
          if (dest.value.interior.__kind === 'X1' && dest.value.interior.value[0].__kind === 'Parachain') {
            to = dest.value.interior.value[0].value.toString();
          }
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
          if (_beneficiary.value.interior.__kind === 'X1') {
            switch (_beneficiary.value.interior.value[0].__kind) {
              case 'AccountId32':
                to = _beneficiary.value.interior.value[0].id;
                break;
              case 'AccountIndex64':
                to = _beneficiary.value.interior.value[0].index.toString();
                break;
              case 'AccountKey20':
                to = _beneficiary.value.interior.value[0].key;
                break;
            }
          }
          break;
      }

      // Assets mapping
      switch (_assets.__kind) {
        case 'V2':
        case 'V3':
          const { amount: _amount } = decodeV1ToV3Assets(_assets);
          amount = _amount;
          break;
        //  No V4's found on chain so far
        case 'V4':
          break;
      }
    } else {
      throw new UnknownVersionError(reserveTransferAssets);
    }

    return { feeAssetItem, amount, to, toChain };
  }
}

function decodeV0Dest(dest: VersionedMultiLocation_V0_V9140 | VersionedMultiLocation_V0_V9370): { parachainDestination: string } {
  let parachainDestination: string = '';

  // most common occuranace of V0 type calls = X1 + Parachain
  if (dest.value.__kind === 'X1' && dest.value.value.__kind === 'Parachain') {
    parachainDestination = dest.value.value.value.toString();
  }

  return { parachainDestination };
}

function decodeV1ToV3Dest(
  dest:
    | VersionedMultiLocation_V1_V9140
    | VersionedMultiLocation_V1_V9370
    | VersionedMultiLocation_V2_V9420
    | VersionedLocation_V2_V100200
    | VersionedMultiLocation_V3_V9420
    | VersionedLocation_V3_V100200
): { parachainDestination: string } {
  let parachainDestination: string = '';

  // most common occuranace of V1 type calls = X1 + Parachain
  if (dest.value.interior.__kind === 'X1' && dest.value.interior.value.__kind === 'Parachain') {
    parachainDestination = dest.value.interior.value.value.toString();
  }

  return { parachainDestination };
}

function decodeV0Beneficiary(_beneficiary: VersionedMultiLocation_V0_V9140 | VersionedMultiLocation_V0_V9370): {
  beneficiaryKey: string;
} {
  let beneficiaryKey: string = '';

  // only support X1 __kind
  if (_beneficiary.value.__kind === 'X1') {
    switch (_beneficiary.value.value.__kind) {
      case 'AccountId32':
        beneficiaryKey = _beneficiary.value.value.id;
        break;
      case 'AccountIndex64':
        beneficiaryKey = _beneficiary.value.value.index.toString();
        break;
      case 'AccountKey20':
        beneficiaryKey = _beneficiary.value.value.key;
        break;
    }
  }

  return { beneficiaryKey };
}

function decodeV1ToV3Beneficiary(
  _beneficiary:
    | VersionedMultiLocation_V1_V9140
    | VersionedMultiLocation_V1_V9370
    | VersionedMultiLocation_V2_V9420
    | VersionedLocation_V2_V100200
    | VersionedMultiLocation_V3_V9420
    | VersionedLocation_V3_V100200
): { beneficiaryKey: string } {
  let beneficiaryKey: string = '';

  // only support X1 __kind
  if (_beneficiary.value.interior.__kind === 'X1') {
    switch (_beneficiary.value.interior.value.__kind) {
      case 'AccountId32':
        beneficiaryKey = _beneficiary.value.interior.value.id;
        break;
      case 'AccountIndex64':
        beneficiaryKey = _beneficiary.value.interior.value.index.toString();
        break;
      case 'AccountKey20':
        beneficiaryKey = _beneficiary.value.interior.value.key;
        break;
    }
  }

  return { beneficiaryKey };
}

function decodeV0Assets(_assets: VersionedMultiAssets_V0_V9140 | asVersionedMultiAssets_V0_V9370): {
  amount: bigint;
} {
  let amount: bigint = 0n;

  // Only support ConcreteFungible __kind as it is the most common
  if (_assets.value[0].__kind === 'ConcreteFungible') {
    amount = _assets.value[0].amount;
  }

  return { amount };
}

function decodeV1ToV3Assets(
  _assets:
    | VersionedMultiAssets_V1_V9140
    | asVersionedMultiAssets_V1_V9370
    | VersionedMultiAssets_V2_V9420
    | VersionedMultiAssets_V3_V9420
    | VersionedAssets_V2_V100200
    | VersionedAssets_V3_V100200
): { amount: bigint } {
  let amount: bigint = 0n;

  switch (_assets.__kind) {
    case 'V1':
    case 'V2':
    case 'V3':
      if (_assets.value[0].id.__kind === 'Concrete') {
        if (_assets.value[0].fun.__kind === 'Fungible') {
          amount = _assets.value[0].fun.value;
        }
      }
      break;
  }

  return { amount };
}
