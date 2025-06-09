// @ts-ignore
import { NftCollection } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface NftMetadataData {
  nftCollection: () => Promise<NftCollection>;
  metadataUri: string;
}

export class SetCollectionMetadataAction extends Action<NftMetadataData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const collection = await this.data.nftCollection();

    if (!collection) return;

    collection.metadataUri = this.data.metadataUri;

    await ctx.store.upsert(collection);
  }
}
