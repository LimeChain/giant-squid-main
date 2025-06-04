import { Account, XTokensTransfer, XTokensTransferAsset, XTokensTransferAssetAmount } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface XTokensTransferActionData {
  id: string;
  account: () => Promise<Account>;
  call: string;
  to?: string;
  toChain?: string;
  assets?: {
    parents: number;
    pallet: string | null;
    assetId: string | null;
    parachain?: string | null;
    fullPath?: string[];
  }[];
  amount?: { type: string; value: string }[];
}

export class XTokensTransferAction extends Action<XTokensTransferActionData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    let xcmTransfer = new XTokensTransfer({
      id: this.data.id,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      extrinsicHash: this.extrinsic?.hash,
      account: await this.data.account(),
      to: this.data.to,
      toChain: this.data.toChain,
      amounts: this.data.amount?.map((amount) => new XTokensTransferAssetAmount({ type: amount.type, value: amount.value })),
      assets:
        this.data.assets?.map(
          (asset) =>
            new XTokensTransferAsset({
              parents: asset.parents,
              pallet: asset.pallet,
              assetId: asset.assetId,
              parachain: asset.parachain,
              fullPath: asset.fullPath,
            })
        ) || [],
      call: this.data.call,
    });

    await ctx.store.insert(xcmTransfer);
  }
}
