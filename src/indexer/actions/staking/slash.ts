import { Account, Staker, StakingSlash } from '../../../model';
import { Action, ActionContext } from '../base';

interface SlashData {
  id: string;
  amount: bigint;
  account: () => Promise<Account>;
  staker: () => Promise<Staker>;
}

export class SlashAction extends Action<SlashData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const account = await this.data.account();
    const staker = await this.data.staker();

    const slash = new StakingSlash({
      id: this.data.id,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      extrinsicHash: this.extrinsic?.hash,
      account: account,
      staker: staker,
      amount: this.data.amount,
    });

    staker.totalBonded -= this.data.amount;
    staker.totalSlashed += this.data.amount;

    await ctx.store.insert(slash);
    await ctx.store.upsert(staker);
  }
}
