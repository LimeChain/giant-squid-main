// @ts-ignore
import { Staker, StakingEraReward } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';
import { calculateEraReturn } from '@/utils/misc';

interface EraRewardData {
  id: string;
  amount: bigint;
  staker: () => Promise<Staker>;
  era?: number;
  validatorId?: string;
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
    const totalRewarded = eraData ? eraData.totalRewarded + this.data.amount : this.data.amount;
    const returnPercentage = calculateEraReturn(totalRewarded, staker.activeBonded);
    if (!returnPercentage) {
      return;
    }

    if (eraData) {
      eraData.totalRewarded = totalRewarded;
      eraData.returnPercentage = returnPercentage;
    } else {
      eraData = new StakingEraReward({
        id: this.data.id,
        staker,
        totalRewarded,
        era: this.data.era,
        returnPercentage,
      });
    }

    await ctx.store.upsert(eraData);
  }
}
