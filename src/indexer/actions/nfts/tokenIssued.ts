// @ts-ignore
import { Account, NftCollection, NFTToken } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface NftTokenData {
  id: string;
  collection: () => Promise<NftCollection | undefined>;
  owner: () => Promise<Account | undefined>;
}

export class IssueNftToken extends Action<NftTokenData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const [owner, nftCollection] = await Promise.all([this.data.owner(), this.data.collection()]);

    if (!owner || !nftCollection) return;

    const newToken = new NFTToken({
      id: this.composeId(this.data.id, nftCollection.id),
      tokenId: this.data.id,
      collection: nftCollection,
      owner,
    });

    await ctx.store.upsert(newToken);
  }
}
