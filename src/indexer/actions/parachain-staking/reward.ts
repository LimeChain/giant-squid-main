// @ts-ignore
import { Account, ParachainStakingReward, Staker } from '@/model';
import { Action, ActionContext } from '../base';

interface ParachainRewardData {
  id: string;
  amount: bigint;
  account: () => Promise<Account>;
  staker: () => Promise<Staker>;
  extrinsicHash: string;
}

export class ParachainRewardAction extends Action<ParachainRewardData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const account = await this.data.account();
    const staker = await this.data.staker();

    const reward = new ParachainStakingReward({
      id: this.data.id,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      extrinsicHash: this.data.extrinsicHash,
      account: account,
      staker: staker,
      amount: this.data.amount,
    });

    staker.totalRewarded += this.data.amount;

    await ctx.store.insert(reward);
    await ctx.store.upsert(staker);
  }
}
