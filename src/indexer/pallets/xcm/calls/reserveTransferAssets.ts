import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
// @ts-ignore
import { Parachain } from '@/model';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { XcmTransferAction } from '@/indexer/actions/xcm/transfer';
import { VersionedMultiAssets, VersionedMultiLocation } from '@/chain/polkadot/types/v9140';
import { VersionedMultiAssets as VersionedMultiAssetsV2, VersionedMultiLocation as VersionedMultiLocationV2 } from '@/chain/polkadot/types/v9370';
import { VersionedMultiAssets as VersionedMultiAssetsV3, VersionedMultiLocation as VersionedMultiLocationV3 } from '@/chain/polkadot/types/v9420';
import { VersionedAssets, VersionedLocation } from '@/chain/polkadot/types/v1002000';

interface DataV9140 {
  dest: VersionedMultiLocation;
  beneficiary: VersionedMultiLocation;
  assets: VersionedMultiAssets;
  feeAssetItem: number;
}
interface DataV9370 {
  dest: VersionedMultiLocationV2;
  beneficiary: VersionedMultiLocationV2;
  assets: VersionedMultiAssetsV2;
  feeAssetItem: number;
}
interface DataV9420 {
  dest: VersionedMultiLocationV3;
  beneficiary: VersionedMultiLocationV3;
  assets: VersionedMultiAssetsV3;
  feeAssetItem: number;
}
interface DataV1002000 {
  dest: VersionedLocation;
  beneficiary: VersionedLocation;
  assets: VersionedAssets;
  feeAssetItem: number;
}

export interface IReserveTransferAssetsPalletDecoder
  extends ICallPalletDecoder<{
    data: DataV9140 | DataV9370 | DataV9420 | DataV1002000;
    destination: number;
    parents: number | null;
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

    const { destination, parents, feeAssetItem } = this.decoder.decode(call);
    const parachain = ctx.store.defer(Parachain, destination.toString());
    if (!parachain) {
      console.dir({ extHash: call.extrinsic?.hash });
      return;
    }

    // fileStream.write(
    //   JSON.stringify(
    //     { block: block.header.height, data: data },
    //     (key, value) => {
    //       if (typeof value === 'bigint') {
    //         return value.toString();
    //       }

    //       return value;
    //     },x
    //     2
    //   )
    // );

    // fileStream.write(',\n');

    queue.push(new XcmTransferAction(block.header, call.extrinsic, { id: call.id, destination: () => parachain.getOrFail(), parents, feeAssetItem }));
  }
}
