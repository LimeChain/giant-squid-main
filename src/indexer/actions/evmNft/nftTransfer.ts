// @ts-ignore
import { Account, NFTCollection, NFTTransfer } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

export interface NftTransferData {
  id: string;
  from: () => Promise<Account>;
  to: () => Promise<Account>;
  collectionId: string;
}

export class EnsureNftTransferAction extends Action<NftTransferData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    let nftTransfer = await ctx.store.findOne(NFTTransfer, { where: { id: this.data.id } });
    if (nftTransfer) return;

    const [from, to, collection] = await Promise.all([this.data.from(), this.data.to(), ctx.store.getOrFail(NFTCollection, this.data.collectionId)]);

    nftTransfer = new NFTTransfer({
      id: this.data.id,
      timestamp: new Date(this.block.timestamp ?? 0),
      blockNumber: this.block.height,
      extrinsicHash: this.extrinsic?.hash,
      from,
      to,
      tokens: [],
      collection,
    });

    if (!nftTransfer) return;

    await ctx.store.insert(nftTransfer);
  }
}
