import { Account, NftCollection, NftHolder, NftToken } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';
import { balances } from '@/chain/acala/types/events';

interface NftTokenData {
  id: string;
  item: number;
  extrinsicHash: any;
  collection: () => Promise<NftCollection>;
  owner: () => Promise<Account>;
}

export class IssueNftToken extends Action<NftTokenData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const [owner, nftCollection] = await Promise.all([this.data.owner(), this.data.collection()]);

    if (!owner || !nftCollection) return;

    if (!nftCollection.tokens) nftCollection.tokens = [];

    // Get or create token holder
    let tokenHolder = await ctx.store.findOne(NftHolder, {
      where: { account: { id: owner.id }, collection: { id: nftCollection.id } },
    });

    if (tokenHolder) {
      tokenHolder.balance++;
    } else {
      tokenHolder = new NftHolder({
        id: this.composeId(owner.id, nftCollection.id),
        account: owner,
        balance: 1,
        collection: nftCollection,
      });
    }

    await ctx.store.upsert(tokenHolder);

    const nftToken = new NftToken({
      id: `${nftCollection.id}-${this.data.item}`,
      collection: nftCollection,
      owner: tokenHolder, // Ensure the owner is always set
    });

    nftCollection.tokens.push(nftToken);

    await ctx.store.upsert(nftToken);
    await ctx.store.upsert(nftCollection);
  }
}
