import { Staker } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface WithdrawnData {
  amount: bigint;
  staker: Staker;
}

export class WithdrawnAction extends Action<WithdrawnData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    this.data.staker.totalUnbonded -= this.data.amount;
    this.data.staker.totalWithdrawn += this.data.amount;

    await ctx.store.upsert(this.data.staker);
  }
}
