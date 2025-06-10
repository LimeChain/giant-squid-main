// @ts-ignore
import { Account, NFTAttribute, NFTToken } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface NftTokenData {
  tokenId: string;
  collectionId: string;
}

export class TokenBurnedAction extends Action<NftTokenData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const token = await ctx.store.findOne(NFTToken, { where: { id: this.composeId(this.data.tokenId, this.data.collectionId) } });
    if (!token) return;

    const token_attributes = await ctx.store.find(NFTAttribute, { where: { token: token } });

    // remove token_attributes first to prevent foreign key constraint error
    await ctx.store.remove(token_attributes);
    await ctx.store.remove(token);
  }
}
