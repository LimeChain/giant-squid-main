import { Account, Staker, StakingReward } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface RewardData {
  id: string;
  amount: bigint;
  account: () => Promise<Account>;
  staker: () => Promise<Staker>;
  era?: number;
  validatorId?: string;
}

export class RewardAction extends Action<RewardData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const account = await this.data.account();
    const staker = await this.data.staker();

    let reward = new StakingReward({
      id: this.data.id,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      extrinsicHash: this.extrinsic?.hash,
      account: account,
      staker: staker,
      amount: this.data.amount,
      era: this.data.era,
      validatorId: this.data.validatorId,
    });

    await ctx.store.insert(reward);
  }
}
