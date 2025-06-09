// @ts-ignore
import { Account, NFTCollection, NftHolder, NFTToken, NFTTokenTransfer, NFTTransfer } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';
import { balances } from '@/chain/acala/types/events';

interface NftTokenTransferData {
  id: string;
  collectionId: string;
  token: number;
  from: () => Promise<Account>;
  to: () => Promise<Account>;
}

export class NftTokenTransfer extends Action<NftTokenTransferData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const from = await this.data.from();
    const to = await this.data.to();

    const token = await ctx.store.findOne(NFTToken, {
      where: { id: this.composeId(this.data.token, this.data.collectionId) },
      relations: { owner: true },
    });

    if (!token) return;

    token.owner = to;

    await ctx.store.upsert(token);
  }
}
