// @ts-ignore
import { Account, XTokensTransfer, XTokensTransferAsset, XTokensTransferAssetAmount, XTokensTransferTo } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface XTokensTransferActionData {
  id: string;
  account: () => Promise<Account>;
  call: string;
  to?: {
    type: string;
    value: string | null;
  };
  toChain?: string | null;
  assets?: {
    parents?: number | null;
    pallet?: string | null;
    assetId?: string | null;
    parachain?: string | null;
    fullPath?: string[];
    error?: string | null;
  }[];
  amount?: { type: string; value: string | null }[];
}

export class XTokensTransferAction extends Action<XTokensTransferActionData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    let xcmTransfer = new XTokensTransfer({
      id: this.data.id,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      extrinsicHash: this.extrinsic?.hash,
      account: await this.data.account(),
      to: new XTokensTransferTo({ type: this.data.to?.type, value: this.data.to?.value }),
      toChain: this.data.toChain,
      amounts: this.data.amount?.map((amount) => new XTokensTransferAssetAmount({ type: amount.type, value: amount.value })) || [],
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
