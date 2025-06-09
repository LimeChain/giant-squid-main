// @ts-ignore
import { NftToken } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface NftMetadataData {
  token: () => Promise<NftToken>;
  metadata: string;
}

export class SetTokenMetadataAction extends Action<NftMetadataData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const token = await this.data.token();

    if (!token) return;

    token.metadataIpfs = this.data.metadata;

    await ctx.store.upsert(token);
  }
}
