// @ts-ignore
import { Account, EraDetail, Staker, StakingReward } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface RewardData {
  id: string;
  amount: bigint;
  account: () => Promise<Account>;
  staker: () => Promise<Staker>;
  era?: number;
  validatorId?: string;
}

function calculateEraReturn(reward: bigint, bondedAmount: bigint): string {
  if (bondedAmount === 0n) {
    return '0.00%';
  }

  const rewardNumber = Number(reward);
  const bondedNumber = Number(bondedAmount);

  const eraReturn = (rewardNumber / bondedNumber) * 100;

  return `${eraReturn.toFixed(2)}%`;
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
    await ctx.store.upsert(staker);
  }
}
