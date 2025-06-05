import { NftCollection } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface NftMetadataData {
  nftCollection: () => Promise<NftCollection>;
  metadata: string;
}

export class SetCollectionMetadataAction extends Action<NftMetadataData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const collection = await this.data.nftCollection();

    if (!collection) return;

    collection.metadataIpfs = this.data.metadata;

    await ctx.store.upsert(collection);
  }
}
