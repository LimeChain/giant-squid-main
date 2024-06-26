import { Account, Staker, StakingSlash } from '../../../model';
import { Action, ActionContext } from '../base';

interface StakerData {
  id: string;
  account: () => Promise<Account>;
  staker: () => Promise<Staker | undefined>;
}

export class EnsureStaker extends Action<StakerData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    let staker = await this.data.staker();

    if (staker) return;

    const account = await this.data.account();

    staker = new Staker({
      id: this.data.id,
      stash: account,
      totalBonded: 0n,
      totalSlashed: 0n,
    });

    await ctx.store.insert(staker);
  }
}
