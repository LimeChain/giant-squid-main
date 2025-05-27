import { Account, NftCollection, NftHolder, NftToken } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';
import { balances } from '@/chain/acala/types/events';

interface NftTokenTransferData {
  id: string;
  collectionId: string;
  token: number;
  collection: () => Promise<NftCollection>;
  from: () => Promise<Account>;
  to: () => Promise<Account>;
}

export class NftTokenTransfer extends Action<NftTokenTransferData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const from = await this.data.from();
    const to = await this.data.to();
    const nftCollection = await this.data.collection();

    const token = await ctx.store.findOne(NftToken, {
      where: {
        id: `${this.data.collectionId}-${this.data.token}`,
      },
      relations: { owner: true }, // Ensure owner is loaded
    });
  }
}
