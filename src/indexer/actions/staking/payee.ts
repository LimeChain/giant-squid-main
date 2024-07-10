import { Account, RewardDestination, Staker } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

export interface SetPayeeData {
  staker: () => Promise<Staker>;
  payeeType: RewardDestination;
  account?: () => Promise<Account> | undefined;
}

export class SetPayeeAction extends Action<SetPayeeData> {
  async _perform(ctx: ActionContext): Promise<void> {
    const staker = await this.data.staker();

    staker.payeeType = this.data.payeeType;

    if (this.data.account) {
      const account = await this.data.account();
      staker.payee = account;
    }

    await ctx.store.upsert(staker);
  }
}
