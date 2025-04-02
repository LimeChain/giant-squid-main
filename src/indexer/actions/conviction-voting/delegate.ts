import { ConvictionDelegate } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface DelegateConvictionVotingData {
  class: number;
  to: string | undefined;
  conviction: string;
  balance: bigint;
}

export class DelegateConvictionVotingAction extends Action<DelegateConvictionVotingData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const delegate = new ConvictionDelegate({
      id: this.extrinsic?.hash,
      class: this.data.class,
      to: this.data.to,
      conviction: this.data.conviction,
      balance: this.data.balance,
    });

    await ctx.store.upsert(delegate);
  }
}
