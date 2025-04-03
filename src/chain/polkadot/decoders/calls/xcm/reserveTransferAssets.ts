import { calls } from '@/chain/polkadot/types';
import {
  VersionedMultiLocation_V0 as VersionedMultiLocation_V0_V9140,
  VersionedMultiLocation_V1 as VersionedMultiLocation_V1_V9140,
} from '@/chain/polkadot/types/v9140';
import {
  VersionedMultiLocation_V0 as VersionedMultiLocation_V0_V9370,
  VersionedMultiLocation_V1 as VersionedMultiLocation_V1_V9370,
} from '@/chain/polkadot/types/v9370';
import {
  VersionedMultiLocation_V2 as VersionedMultiLocation_V2_V9420,
  VersionedMultiLocation_V3 as VersionedMultiLocation_V3_V9420,
} from '@/chain/polkadot/types/v9420';
import { VersionedLocation_V2 as VersionedLocation_V2_V100200, VersionedLocation_V3 as VersionedLocation_V3_V100200 } from '@/chain/polkadot/types/v1002000';
import { Call } from '@/indexer';
import { IReserveTransferAssetsPalletDecoder, IXcmDestination, IXcmTransferBeneficiary } from '@/indexer/pallets/xcm/calls/reserveTransferAssets';
import { UnknownVersionError } from '@/utils';
import path from 'path';
import os from 'os';
import fs from 'fs';

const WRITE = true;
const filePath = path.join(os.homedir(), 'Desktop', 'xcm_reserve_transfer_early.json');
const start = fs.readFileSync(filePath);
const fileStream = fs.createWriteStream(filePath, { start: start.length });

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
    let destination: IXcmDestination = { parachain: null, parents: null };
    let beneficiary: IXcmTransferBeneficiary = { parents: null, key: { kind: '', value: '' } };
    let feeAssetItem: number = 0;

    if (reserveTransferAssets.v9140.is(call)) {
      const data = reserveTransferAssets.v9140.decode(call);
      if (WRITE) write(data);

      const { assets: _assets, beneficiary: _beneficiary, feeAssetItem: _fee, dest } = data;
      feeAssetItem = _fee;

      // Destination mapping
      switch (dest.__kind) {
        case 'V0': {
          const { parachainDestination } = decodeV0Dest(dest);
          destination.parachain = parachainDestination;
          break;
        }

        case 'V1': {
          const { parachainDestination } = decodeV1ToV3Dest(dest);
          destination.parachain = parachainDestination;
          destination.parents = dest.value.parents;
          break;
        }
      }

      // Beneficiary mapping
      switch (_beneficiary.__kind) {
        case 'V0': {
          const { beneficiaryKey } = decodeV0Beneficiary(_beneficiary);
          beneficiary.key = beneficiaryKey;
          break;
        }
        case 'V1': {
          const { beneficiaryKey } = decodeV1ToV3Beneficiary(_beneficiary);
          beneficiary.key = beneficiaryKey;
          beneficiary.parents = _beneficiary.value.parents;
          break;
        }
      }
    } else if (reserveTransferAssets.v9370.is(call)) {
      const data = reserveTransferAssets.v9370.decode(call);
      if (WRITE) write(data);

      const { assets, beneficiary: _beneficiary, feeAssetItem: _fee, dest } = data;
      feeAssetItem = _fee;

      // Destination mapping
      switch (dest.__kind) {
        case 'V0': {
          const { parachainDestination } = decodeV0Dest(dest);
          destination.parachain = parachainDestination;
          break;
        }

        case 'V1': {
          const { parachainDestination } = decodeV1ToV3Dest(dest);
          destination.parachain = parachainDestination;
          destination.parents = dest.value.parents;
          break;
        }
      }

      // Beneficiary mapping
      switch (_beneficiary.__kind) {
        case 'V0': {
          const { beneficiaryKey } = decodeV0Beneficiary(_beneficiary);
          beneficiary.key = beneficiaryKey;
          break;
        }
        case 'V1': {
          const { beneficiaryKey } = decodeV1ToV3Beneficiary(_beneficiary);
          beneficiary.key = beneficiaryKey;
          beneficiary.parents = _beneficiary.value.parents;
          break;
        }
      }
    } else if (reserveTransferAssets.v9420.is(call)) {
      const data = reserveTransferAssets.v9420.decode(call);
      if (WRITE) write(data);

      const { assets, beneficiary: _beneficiary, feeAssetItem: _fee, dest } = data;
      feeAssetItem = _fee;

      // Destination mapping
      switch (dest.__kind) {
        case 'V2': {
          const { parachainDestination } = decodeV1ToV3Dest(dest);
          destination.parachain = parachainDestination;
          destination.parents = dest.value.parents;
          break;
        }

        case 'V3': {
          const { parachainDestination } = decodeV1ToV3Dest(dest);
          destination.parachain = parachainDestination;
          destination.parents = dest.value.parents;
          break;
        }
      }

      // Beneficiary mapping
      switch (_beneficiary.__kind) {
        case 'V2': {
          const { beneficiaryKey } = decodeV1ToV3Beneficiary(_beneficiary);
          beneficiary.key = beneficiaryKey;
          beneficiary.parents = _beneficiary.value.parents;
          break;
        }
        case 'V3': {
          const { beneficiaryKey } = decodeV1ToV3Beneficiary(_beneficiary);
          beneficiary.key = beneficiaryKey;
          beneficiary.parents = _beneficiary.value.parents;
          break;
        }
      }
    } else if (reserveTransferAssets.v1002000.is(call)) {
      const data = reserveTransferAssets.v1002000.decode(call);
      if (WRITE) write(data);

      const { assets, beneficiary: _beneficiary, feeAssetItem: _fee, dest } = data;
      feeAssetItem = _fee;

      // Destination mapping
      switch (dest.__kind) {
        case 'V2': {
          const { parachainDestination } = decodeV1ToV3Dest(dest);
          destination.parachain = parachainDestination;
          destination.parents = dest.value.parents;
          break;
        }

        case 'V3': {
          const { parachainDestination } = decodeV1ToV3Dest(dest);
          destination.parachain = parachainDestination;
          destination.parents = dest.value.parents;
          break;
        }

        case 'V4':
          destination.parents = dest.value.parents;

          // most common occuranace of V4 type calls = X1 + Parachain
          if (dest.value.interior.__kind === 'X1' && dest.value.interior.value[0].__kind === 'Parachain') {
            destination.parachain = dest.value.interior.value[0].value;
          }
          break;
      }

      // Beneficiary mapping
      switch (_beneficiary.__kind) {
        case 'V2': {
          const { beneficiaryKey } = decodeV1ToV3Beneficiary(_beneficiary);
          beneficiary.key = beneficiaryKey;
          beneficiary.parents = _beneficiary.value.parents;
          break;
        }
        case 'V3': {
          const { beneficiaryKey } = decodeV1ToV3Beneficiary(_beneficiary);
          beneficiary.key = beneficiaryKey;
          beneficiary.parents = _beneficiary.value.parents;
          break;
        }

        case 'V4':
          if (_beneficiary.value.interior.__kind === 'X1') {
            beneficiary.parents = _beneficiary.value.parents;
            beneficiary.key.kind = _beneficiary.value.interior.value[0].__kind;
            switch (_beneficiary.value.interior.value[0].__kind) {
              case 'AccountId32':
                beneficiary.key.value = _beneficiary.value.interior.value[0].id;
                break;
              case 'AccountIndex64':
                beneficiary.key.value = _beneficiary.value.interior.value[0].index.toString();
                break;
              case 'AccountKey20':
                beneficiary.key.value = _beneficiary.value.interior.value[0].key;
                break;
            }
          }
          break;
      }
    } else {
      throw new UnknownVersionError(reserveTransferAssets);
    }

    return { destination, feeAssetItem, beneficiary };
  }
}

function decodeV0Dest(dest: VersionedMultiLocation_V0_V9140 | VersionedMultiLocation_V0_V9370): { parachainDestination: IXcmDestination['parachain'] } {
  let parachainDestination: IXcmDestination['parachain'] = null;

  // most common occuranace of V0 type calls = X1 + Parachain
  if (dest.value.__kind === 'X1' && dest.value.value.__kind === 'Parachain') {
    parachainDestination = dest.value.value.value;
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
): { parachainDestination: IXcmDestination['parachain'] } {
  let parachainDestination: IXcmDestination['parachain'] = null;

  // most common occuranace of V1 type calls = X1 + Parachain
  if (dest.value.interior.__kind === 'X1' && dest.value.interior.value.__kind === 'Parachain') {
    parachainDestination = dest.value.interior.value.value;
  }

  return { parachainDestination };
}

function decodeV0Beneficiary(_beneficiary: VersionedMultiLocation_V0_V9140 | VersionedMultiLocation_V0_V9370): {
  beneficiaryKey: IXcmTransferBeneficiary['key'];
} {
  let beneficiaryKey: IXcmTransferBeneficiary['key'] = { kind: '', value: 'null' };

  // only support X1 __kind
  if (_beneficiary.value.__kind === 'X1') {
    beneficiaryKey.kind = _beneficiary.value.value.__kind;
    switch (_beneficiary.value.value.__kind) {
      case 'AccountId32':
        beneficiaryKey.value = _beneficiary.value.value.id;
        break;
      case 'AccountIndex64':
        beneficiaryKey.value = _beneficiary.value.value.index.toString();
        break;
      case 'AccountKey20':
        beneficiaryKey.value = _beneficiary.value.value.key;
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
): { beneficiaryKey: IXcmTransferBeneficiary['key'] } {
  let beneficiaryKey: IXcmTransferBeneficiary['key'] = { kind: '', value: 'null' };

  // only support X1 __kind
  if (_beneficiary.value.interior.__kind === 'X1') {
    beneficiaryKey.kind = _beneficiary.value.interior.value.__kind;
    switch (_beneficiary.value.interior.value.__kind) {
      case 'AccountId32':
        beneficiaryKey.value = _beneficiary.value.interior.value.id;
        break;
      case 'AccountIndex64':
        beneficiaryKey.value = _beneficiary.value.interior.value.index.toString();
        break;
      case 'AccountKey20':
        beneficiaryKey.value = _beneficiary.value.interior.value.key;
        break;
    }
  }

  return { beneficiaryKey };
}

// OLD
// export class ReserveTransferAssetsCallDecoder implements IReserveTransferAssetsPalletDecoder {
//   decode(call: Call) {
//     const { reserveTransferAssets } = calls.xcmPallet;
//     // Destination is always present
//     let destination: number = 0;
//     // dest.__kind: "V0" has no parents field, hence the null option
//     let parents: number | null = null;

//     if (reserveTransferAssets.v9140.is(call)) {
//       const data = reserveTransferAssets.v9140.decode(call);
//       const { assets, beneficiary, feeAssetItem, dest } = data;

//       switch (dest.__kind) {
//         case 'V0':
//           // most common occurnace of V0 type calls = X1 + Parachain
//           if (dest.value.__kind === 'X1' && dest.value.value.__kind === 'Parachain') {
//             destination = dest.value.value.value;
//             return {
//               data: {
//                 ...data,
//                 dest: {
//                   valueV0: {
//                     kind: dest.value.__kind,
//                     value: { isTypeOf: 'V0JunctionParachain', kind: dest.value.value.__kind, value: dest.value.value.value },
//                     isTypeOf: 'V0MultiLocationX1',
//                   },
//                   kind: dest.__kind,
//                   isTypeOf: 'VersionedMultiLocationV0',
//                 },
//               } as unknown as VersionedMultiLocation,
//               destination,
//               parents,
//               feeAssetItem,
//             };
//           }
//           break;

//         case 'V1': {
//           parents = dest.value.parents;
//           // most common occurnace of V1 type calls = X1 + Parachain
//           if (dest.value.interior.__kind === 'X1' && dest.value.interior.value.__kind === 'Parachain') {
//             destination = dest.value.interior.value.value;
//             return {
//               data: {
//                 ...data,
//                 dest: {
//                   valueV1: {
//                     parents: dest.value.parents,
//                     interior: {
//                       value: { isTypeOf: 'V1JunctionParachain', value: dest.value.interior.value.value, kind: dest.value.interior.value.__kind },
//                       kind: dest.value.interior.__kind,
//                       isTypeOf: 'V1JunctionsX1',
//                     },
//                   },
//                   kind: data.dest.__kind,
//                   isTypeOf: 'VersionedMultiLocationV1',
//                 },
//               } as unknown as VersionedMultiLocation,
//               destination,
//               parents,
//               feeAssetItem,
//             };
//           }
//           break;
//         }

//         default:
//           return { data, destination, parents, feeAssetItem };
//       }
//     } else if (reserveTransferAssets.v9370.is(call)) {
//       const data = reserveTransferAssets.v9370.decode(call);
//       const { assets, beneficiary, feeAssetItem, dest } = data;

//       switch (dest.__kind) {
//         case 'V0':
//           // most common occurnace of V0 type calls = X1 + Parachain
//           if (dest.value.__kind === 'X1' && dest.value.value.__kind === 'Parachain') {
//             destination = dest.value.value.value;
//             return {
//               data: {
//                 ...data,
//                 dest: {
//                   valueV0: {
//                     kind: dest.value.__kind,
//                     value: { isTypeOf: 'V0JunctionParachain', kind: dest.value.value.__kind, value: dest.value.value.value },
//                     isTypeOf: 'V0MultiLocationX1',
//                   },
//                   kind: dest.__kind,
//                   isTypeOf: 'VersionedMultiLocationV0',
//                 },
//               } as unknown as VersionedMultiLocation,
//               destination,
//               parents,
//               feeAssetItem,
//             };
//           }
//           break;

//         case 'V1':
//           parents = dest.value.parents;
//           // most common occurnace of V1 type calls = X1 + Parachain
//           if (dest.value.interior.__kind === 'X1' && dest.value.interior.value.__kind === 'Parachain') {
//             destination = dest.value.interior.value.value;
//             return {
//               data: {
//                 ...data,
//                 dest: {
//                   valueV1: {
//                     parents: dest.value.parents,
//                     interior: {
//                       value: { isTypeOf: 'V1JunctionParachain', value: dest.value.interior.value.value, kind: dest.value.interior.value.__kind },
//                       kind: dest.value.interior.__kind,
//                       isTypeOf: 'V1JunctionsX1',
//                     },
//                   },
//                   kind: data.dest.__kind,
//                   isTypeOf: 'VersionedMultiLocationV1',
//                 },
//               } as unknown as VersionedMultiLocation,
//               destination,
//               parents,
//               feeAssetItem,
//             };
//           }
//         default:
//           return { data, destination, parents, feeAssetItem };
//       }
//     } else if (reserveTransferAssets.v9420.is(call)) {
//       const data = reserveTransferAssets.v9420.decode(call);
//       const { assets, beneficiary, feeAssetItem, dest } = data;

//       //   switch (dest.__kind) {
//       //     case 'V2':
//       //       if (dest.value.interior.__kind === 'X1' && dest.value.interior.value.__kind === 'Parachain') {
//       //         destination = dest.value.interior.value.value;
//       //       }
//       //       break;

//       //     case 'V3':
//       //       if (dest.value.interior.__kind === 'X1' && dest.value.interior.value.__kind === 'Parachain') {
//       //         destination = dest.value.interior.value.value;
//       //       }
//       //       break;
//       //   }
//       return { data, destination, parents, feeAssetItem };
//     } else if (reserveTransferAssets.v1002000.is(call)) {
//       const data = reserveTransferAssets.v1002000.decode(call);
//       const { assets, beneficiary, feeAssetItem, dest } = data;

//       //   switch (dest.__kind) {
//       //     case 'V2':
//       //       if (dest.value.interior.__kind === 'X1' && dest.value.interior.value.__kind === 'Parachain') {
//       //         destination = dest.value.interior.value.value;
//       //       }
//       //       break;

//       //     case 'V3':
//       //       if (dest.value.interior.__kind === 'X1' && dest.value.interior.value.__kind === 'Parachain') {
//       //         destination = dest.value.interior.value.value;
//       //       }
//       //       break;

//       //     // no calls of type V4 so far
//       //     case 'V4':
//       //       break;
//       //   }

//       return { data, assets, beneficiary, feeAssetItem, dest };
//     } else {
//       throw new UnknownVersionError(reserveTransferAssets);
//     }
//   }
// }
