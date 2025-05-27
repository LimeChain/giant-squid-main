import { NftCollection, NftToken } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface NftTokenData {
  token: () => Promise<NftToken>;
  collection: () => Promise<NftCollection>;
}

export class TokenBurnedAction extends Action<NftTokenData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const token = await this.data.token();
    const nftCollection = await this.data.collection();

    if (!token) return;

    await ctx.store.remove(token);
  }
}
