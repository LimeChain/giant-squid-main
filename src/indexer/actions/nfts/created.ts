import { Account, NftCollection } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface NftData {
  id: string;
  collection: number;
  creator: () => Promise<Account>;
  owner: () => Promise<Account>;
}

export class CreateNftAction extends Action<NftData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const owner = await this.data.owner();
    const creator = await this.data.creator();

    if (!owner || !creator) {
      return;
    }

    const nftCollection = new NftCollection({
      id: this.data.collection.toString(),
      owner: owner,
      // holders: undefined,
      metadataIpfs: null,
    });

    await ctx.store.insert(nftCollection);
  }
}
