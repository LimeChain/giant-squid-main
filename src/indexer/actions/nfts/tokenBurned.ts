// @ts-ignore
import { NftCollection, NFTToken } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface NftTokenData {
  tokenId: string;
  collectionId: string;
  owner: () => Promise<NftCollection>;
}

export class TokenBurnedAction extends Action<NftTokenData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const owner = await this.data.owner();

    const token = await ctx.store.findOne(NFTToken, { where: { id: this.composeId(this.data.tokenId, this.data.collectionId) } });

    if (!token) {
      console.warn(`NFT token ${this.data.tokenId} from collection ${this.data.collectionId} not found for owner ${owner.id}`);
      return;
    }

    if (!token) return;

    await ctx.store.remove(token);
  }
}
