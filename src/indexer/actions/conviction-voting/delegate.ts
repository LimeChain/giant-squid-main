import { Account, ConvictionDelegate } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface DelegateConvictionVotingData {
  id: string;
  extrinsicHash: string | undefined;
  from: () => Promise<Account>;
  to: () => Promise<Account | undefined>;
  class: number;
  conviction: string;
  balance: bigint;
}

export class DelegateConvictionVotingAction extends Action<DelegateConvictionVotingData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const to = await this.data.to?.();
    let from = await this.data.from?.();

    const delegate = new ConvictionDelegate({
      id: this.data.id,
      extrinsicHash: this.data.extrinsicHash,
      class: this.data.class,
      from,
      to,
      conviction: this.data.conviction,
      balance: this.data.balance,
    });

    await ctx.store.upsert(delegate);
  }
}
