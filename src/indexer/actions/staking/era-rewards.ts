// @ts-ignore
import { Account, EraDetail, Staker, StakingEraReward, StakingReward } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface EraRewardData {
  id: string;
  amount: bigint;
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

export class EraRewardAction extends Action<EraRewardData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    if (!this.data.era) {
      return;
    }
    const staker = await this.data.staker();
    let eraData = await ctx.store.findOneBy(StakingEraReward, {
      staker: staker,
      era: this.data.era,
    });

    if (eraData) {
      eraData.totalRewarded += this.data.amount;
      eraData.returnPercentage = calculateEraReturn(eraData.totalRewarded, staker.activeBonded);
    } else {
      let returnPercentage = calculateEraReturn(this.data.amount, staker.activeBonded);

      if (returnPercentage === '0.00%') {
        return;
      }

      eraData = new StakingEraReward({
        id: this.data.id,
        staker: staker,
        totalRewarded: this.data.amount,
        era: this.data.era,
        returnPercentage,
      });
    }

    await ctx.store.upsert(eraData);
  }
}
