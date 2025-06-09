// @ts-ignore
import { NFTToken, NftToken } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface NftMetadataData {
  collectionId: string;
  tokenId: string;
  metadata: string;
}

export class SetTokenMetadataAction extends Action<NftMetadataData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const token = await ctx.store.findOne(NFTToken, {
      where: { id: this.composeId(this.data.tokenId, this.data.collectionId) },
      relations: { owner: true },
    });

    if (!token) return;

    token.metadataUri = this.data.metadata;

    await ctx.store.upsert(token);
  }
}
