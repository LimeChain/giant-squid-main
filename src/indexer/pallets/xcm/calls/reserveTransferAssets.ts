import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { Account, Parachain } from '@/model';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { XcmTransferAction } from '@/indexer/actions/xcm/transfer';
import { VersionedMultiAssets, VersionedMultiLocation } from '@/chain/polkadot/types/v9140';
import { VersionedMultiAssets as VersionedMultiAssetsV2, VersionedMultiLocation as VersionedMultiLocationV2 } from '@/chain/polkadot/types/v9370';
import { VersionedMultiAssets as VersionedMultiAssetsV3, VersionedMultiLocation as VersionedMultiLocationV3 } from '@/chain/polkadot/types/v9420';
import { VersionedAssets, VersionedLocation } from '@/chain/polkadot/types/v1002000';

// interface DataV9140 {
//   dest: VersionedMultiLocation;
//   beneficiary: VersionedMultiLocation;
//   assets: VersionedMultiAssets;
//   feeAssetItem: number;
// }
// interface DataV9370 {
//   dest: VersionedMultiLocationV2;
//   beneficiary: VersionedMultiLocationV2;
//   assets: VersionedMultiAssetsV2;
//   feeAssetItem: number;
// }
// interface DataV9420 {
//   dest: VersionedMultiLocationV3;
//   beneficiary: VersionedMultiLocationV3;
//   assets: VersionedMultiAssetsV3;
//   feeAssetItem: number;
// }
// interface DataV1002000 {
//   dest: VersionedLocation;
//   beneficiary: VersionedLocation;
//   assets: VersionedAssets;
//   feeAssetItem: number;
// }

export interface IXcmDestination {
  parents: number | null;
  parachain: number | null;
}
export interface IReserveTransferAssetsPalletDecoder
  extends ICallPalletDecoder<{
    //   data: DataV9140 | DataV9370 | DataV9420 | DataV1002000;
    destination: IXcmDestination;
    feeAssetItem: number;
  }> {}

interface IReserveTransferAssetsPalletSetup extends IBasePalletSetup {
  decoder: IReserveTransferAssetsPalletDecoder;
}

const filePath = path.join(os.homedir(), 'Desktop', 'xcm_reserve_transfer_early.json');
// const fileStream = fs.createWriteStream(filePath);
// fileStream.write('[\n');

// process.on('beforeExit', () => {
//   fileStream.write('\n]');
//   fileStream.end();
// });
export class ReserveTransferAssetsPalletXcmHandler extends CallPalletHandler<IReserveTransferAssetsPalletSetup> {
  constructor(setup: IReserveTransferAssetsPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }
  async handle({ ctx, block, queue, item: call }: ICallHandlerParams) {
    if (!call.success) return;
    const { destination, feeAssetItem } = this.decoder.decode(call);
    // fileStream.write(
    //   JSON.stringify(
    //     { block: block.header.height, data: decoded.data },
    //     (key, value) => {
    //       if (typeof value === 'bigint') {
    //         return value.toString();
    //       }
    //       return value;
    //     },
    //     2
    //   )
    // );
    // fileStream.write(',\n');

    // a supported call has been successfully decoded
    if (typeof destination.parachain === 'number') {
      const fromPubKey = call.origin.value.value;
      // testing
      if (!fromPubKey) {
        console.log('ERROR', call.id, block.header.height);
        process.exit(0);
      }
      //   const parachain = ctx.store.defer(Parachain, decoded.destination.toString());
      //   const account = ctx.store.defer(Account, fromPubKey);
      //   if (!parachain) return;

      queue.push(
        new XcmTransferAction(block.header, call.extrinsic, {
          id: call.id,
          destination: () => Promise.resolve(destination),
          from: fromPubKey,
          feeAssetItem: feeAssetItem,
        })
      );
    } else {
      console.dir({ call: call.block.hash });
      process.exit(0);
    }
  }
}
