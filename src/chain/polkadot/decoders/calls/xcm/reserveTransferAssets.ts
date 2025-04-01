import { calls } from '@/chain/polkadot/types';
import { VersionedMultiLocation } from '@/chain/polkadot/types/v9140';
import { Call } from '@/indexer';
import { IReserveTransferAssetsPalletDecoder } from '@/indexer/pallets/xcm/calls/reserveTransferAssets';
import { UnknownVersionError } from '@/utils';

export class ReserveTransferAssetsCallDecoder implements IReserveTransferAssetsPalletDecoder {
  decode(call: Call) {
    const { reserveTransferAssets } = calls.xcmPallet;
    // Destination is always present
    let destination: number = 0;
    // dest.__kind: "V0" has no parents field, hence the null option
    let parents: number | null = null;

    if (reserveTransferAssets.v9140.is(call)) {
      const data = reserveTransferAssets.v9140.decode(call);
      const { assets, beneficiary, feeAssetItem, dest } = data;

      switch (dest.__kind) {
        case 'V0':
          // most common occurnace of V0 type calls = X1 + Parachain
          if (dest.value.__kind === 'X1' && dest.value.value.__kind === 'Parachain') {
            destination = dest.value.value.value;
            return {
              data: {
                ...data,
                dest: {
                  valueV0: {
                    kind: dest.value.__kind,
                    value: { isTypeOf: 'V0JunctionParachain', kind: dest.value.value.__kind, value: dest.value.value.value },
                    isTypeOf: 'V0MultiLocationX1',
                  },
                  kind: dest.__kind,
                  isTypeOf: 'VersionedMultiLocationV0',
                },
              } as unknown as VersionedMultiLocation,
              destination,
              parents,
              feeAssetItem,
            };
          }
          break;

        case 'V1': {
          parents = dest.value.parents;
          // most common occurnace of V1 type calls = X1 + Parachain
          if (dest.value.interior.__kind === 'X1' && dest.value.interior.value.__kind === 'Parachain') {
            destination = dest.value.interior.value.value;
            return {
              data: {
                ...data,
                dest: {
                  valueV1: {
                    parents: dest.value.parents,
                    interior: {
                      value: { isTypeOf: 'V1JunctionParachain', value: dest.value.interior.value.value, kind: dest.value.interior.value.__kind },
                      kind: dest.value.interior.__kind,
                      isTypeOf: 'V1JunctionsX1',
                    },
                  },
                  kind: data.dest.__kind,
                  isTypeOf: 'VersionedMultiLocationV1',
                },
              } as unknown as VersionedMultiLocation,
              destination,
              parents,
              feeAssetItem,
            };
          }
          break;
        }

        default:
          return { data, destination, parents, feeAssetItem };
      }
    } else if (reserveTransferAssets.v9370.is(call)) {
      const data = reserveTransferAssets.v9370.decode(call);
      const { assets, beneficiary, feeAssetItem, dest } = data;

      switch (dest.__kind) {
        case 'V0':
          // most common occurnace of V0 type calls = X1 + Parachain
          if (dest.value.__kind === 'X1' && dest.value.value.__kind === 'Parachain') {
            destination = dest.value.value.value;
            return {
              data: {
                ...data,
                dest: {
                  valueV0: {
                    kind: dest.value.__kind,
                    value: { isTypeOf: 'V0JunctionParachain', kind: dest.value.value.__kind, value: dest.value.value.value },
                    isTypeOf: 'V0MultiLocationX1',
                  },
                  kind: dest.__kind,
                  isTypeOf: 'VersionedMultiLocationV0',
                },
              } as unknown as VersionedMultiLocation,
              destination,
              parents,
              feeAssetItem,
            };
          }
          break;

        case 'V1':
          parents = dest.value.parents;
          // most common occurnace of V1 type calls = X1 + Parachain
          if (dest.value.interior.__kind === 'X1' && dest.value.interior.value.__kind === 'Parachain') {
            destination = dest.value.interior.value.value;
            return {
              data: {
                ...data,
                dest: {
                  valueV1: {
                    parents: dest.value.parents,
                    interior: {
                      value: { isTypeOf: 'V1JunctionParachain', value: dest.value.interior.value.value, kind: dest.value.interior.value.__kind },
                      kind: dest.value.interior.__kind,
                      isTypeOf: 'V1JunctionsX1',
                    },
                  },
                  kind: data.dest.__kind,
                  isTypeOf: 'VersionedMultiLocationV1',
                },
              } as unknown as VersionedMultiLocation,
              destination,
              parents,
              feeAssetItem,
            };
          }
        default:
          return { data, destination, parents, feeAssetItem };
      }
    } else if (reserveTransferAssets.v9420.is(call)) {
      const data = reserveTransferAssets.v9420.decode(call);
      const { assets, beneficiary, feeAssetItem, dest } = data;

      //   switch (dest.__kind) {
      //     case 'V2':
      //       if (dest.value.interior.__kind === 'X1' && dest.value.interior.value.__kind === 'Parachain') {
      //         destination = dest.value.interior.value.value;
      //       }
      //       break;

      //     case 'V3':
      //       if (dest.value.interior.__kind === 'X1' && dest.value.interior.value.__kind === 'Parachain') {
      //         destination = dest.value.interior.value.value;
      //       }
      //       break;
      //   }
      return { data, destination, parents, feeAssetItem };
    } else if (reserveTransferAssets.v1002000.is(call)) {
      const data = reserveTransferAssets.v1002000.decode(call);
      const { assets, beneficiary, feeAssetItem, dest } = data;

      //   switch (dest.__kind) {
      //     case 'V2':
      //       if (dest.value.interior.__kind === 'X1' && dest.value.interior.value.__kind === 'Parachain') {
      //         destination = dest.value.interior.value.value;
      //       }
      //       break;

      //     case 'V3':
      //       if (dest.value.interior.__kind === 'X1' && dest.value.interior.value.__kind === 'Parachain') {
      //         destination = dest.value.interior.value.value;
      //       }
      //       break;

      //     // no calls of type V4 so far
      //     case 'V4':
      //       break;
      //   }

      return { data, assets, beneficiary, feeAssetItem, dest };
    } else {
      throw new UnknownVersionError(reserveTransferAssets);
    }
  }
}
