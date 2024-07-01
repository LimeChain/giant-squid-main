import { Account, Staker } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

export interface SetPayeeData {
  staker: () => Promise<Staker>;
  payeeId: string | undefined;
}

export class SetPayeeAction extends Action<SetPayeeData> {
  async _perform(ctx: ActionContext): Promise<void> {
    const staker = await this.data.staker();

    staker.payee = this.data.payeeId ? await ctx.store.getOrFail(Account, this.data.payeeId) : null;

    await ctx.store.upsert(staker);
  }
}
