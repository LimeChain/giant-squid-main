import { Staker } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface WithdrawnData {
  amount: bigint;
  staker: () => Promise<Staker>;
}

export class WithdrawnAction extends Action<WithdrawnData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const staker = await this.data.staker();

    staker.totalWithdrawn += this.data.amount;

    await ctx.store.upsert(staker);
  }
}
