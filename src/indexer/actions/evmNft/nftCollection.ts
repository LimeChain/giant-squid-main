import { Account, NFTCollection, NFTToken } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

export interface NftCollectionData {
  id: string;
  nftCollection: () => Promise<NFTCollection | undefined>;
}

export class EnsureNFTCollection extends Action<NftCollectionData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    let nftCollection = await this.data.nftCollection();
    if (nftCollection) return;

    nftCollection = new NFTCollection({
      id: this.data.id,
    });

    await ctx.store.insert(nftCollection);
  }
}
