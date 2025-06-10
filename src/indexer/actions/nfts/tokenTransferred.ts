// @ts-ignore
import { Account, NFTToken } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface NftTokenTransferData {
  collectionId: string;
  token: number;
  from: () => Promise<Account>;
  to: () => Promise<Account>;
}

export class NftTokenTransfer extends Action<NftTokenTransferData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const to = await this.data.to();

    const token = await ctx.store.findOne(NFTToken, {
      where: { id: this.composeId(this.data.token, this.data.collectionId) },
      relations: { owner: true },
    });

    if (!token) return;

    token.owner = to;

    await ctx.store.save(token);
  }
}
