// @ts-ignore
import { Account, ConvictionUndelegate } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface UndelegateConvictionVotingData {
  id: string;
  class: number | undefined;
  extrinsicHash: string | undefined;
  account: () => Promise<Account>;
}

export class UndelegateConvictionVotingAction extends Action<UndelegateConvictionVotingData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const account = await this.data.account?.();

    const delegate = new ConvictionUndelegate({
      id: this.data.id,
      extrinsicHash: this.data.extrinsicHash,
      class: this.data.class,
      account,
    });

    await ctx.store.upsert(delegate);
  }
}
