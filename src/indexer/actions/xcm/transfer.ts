import { Account, XcmTransfer, XcmTransferDestination } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';
import { IXcmDestination } from '@/indexer/pallets/xcm/calls/reserveTransferAssets';

interface XcmTransferActionData {
  id: string;
  destination: () => Promise<{ parachain: IXcmDestination['parachain']; parents: IXcmDestination['parents'] }>;
  //   destination: () => Promise<Parachain>;
  feeAssetItem: number;
  from: string;
  //   from: () => Promise<Account>;
}
export class XcmTransferAction extends Action<XcmTransferActionData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const xcmDestination = await this.data.destination().catch();
    if (!xcmDestination) return;

    let xcmTransferDestination = new XcmTransferDestination({
      id: this.data.id,
      parachain: xcmDestination.parachain?.toString(),
      parents: xcmDestination.parents,
    });
    await ctx.store.insert(xcmTransferDestination);

    let xcmTransfer = new XcmTransfer({
      id: this.data.id,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      extrinsicHash: this.extrinsic?.hash,
      from: this.data.from,
      feeAssetItem: this.data.feeAssetItem,
      destination: xcmTransferDestination,
    });
    await ctx.store.insert(xcmTransfer);
  }
}
