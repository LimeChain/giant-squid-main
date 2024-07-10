import { Account, RewardDestination, Staker } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

export interface SetPayeeData {
  staker: () => Promise<Staker>;
  payeeId: string | undefined;
}

export interface SetPayeeTypeData {
  staker: () => Promise<Staker>;
  payeeType: RewardDestination;
  account?: () => Promise<Account>;
}

export class SetPayeeAction extends Action<SetPayeeData> {
  async _perform(ctx: ActionContext): Promise<void> {
    const staker = await this.data.staker();

    staker.payee = this.data.payeeId ? await ctx.store.getOrFail(Account, this.data.payeeId) : null;

    await ctx.store.upsert(staker);
  }
}

export class SetPayeeTypeAction extends Action<SetPayeeTypeData> {
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
