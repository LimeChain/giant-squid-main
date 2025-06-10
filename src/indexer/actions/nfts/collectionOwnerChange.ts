// @ts-ignore
import { Account, NFTCollection } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface NftMetadataData {
  nftCollection: () => Promise<NFTCollection>;
  newOwner: () => Promise<Account>;
}

export class CollectionOwnerChangeAction extends Action<NftMetadataData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const collection = await this.data.nftCollection();
    const newOwner = await this.data.newOwner();

    if (!collection) return;

    collection.owner = newOwner;

    await ctx.store.save(collection);
  }
}
