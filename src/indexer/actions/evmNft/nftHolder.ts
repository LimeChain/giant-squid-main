import { Account, NFTCollection, NFTHolder, NFTToken } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

export interface NftHolderData {
  id: string;
  nftHolder: () => Promise<NFTHolder | undefined>;
  account: () => Promise<Account>;
  nftCollection: () => Promise<NFTCollection>;
}

export class EnsureNFTHolder extends Action<NftHolderData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    let [nftHolder, account, nftCollection] = await Promise.all([this.data.nftHolder(), this.data.account(), this.data.nftCollection()]);

    if (!account || !nftCollection) return;
    if (nftHolder) return;

    nftHolder = new NFTHolder({
      id: this.composeId(this.data.id, nftCollection.id),
      account,
      collection: nftCollection,
      nftCount: 0,
    });

    await ctx.store.insert(nftHolder);
  }
}
