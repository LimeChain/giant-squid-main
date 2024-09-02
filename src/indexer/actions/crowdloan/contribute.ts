import { Crowdloan, CrowdloanContribution, CrowdloanContributor } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface ContributeCrowdloanData {
  id: string;
  amount: bigint;
  contributor: () => Promise<CrowdloanContributor>;
  crowdloan: () => Promise<Crowdloan>;
}

export class ContributeCrowdloanAction extends Action<ContributeCrowdloanData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const crowdloan = await this.data.crowdloan();
    const contributor = await this.data.contributor();

    const contribution = new CrowdloanContribution({
      id: this.data.id,
      amount: this.data.amount,
      crowdloan,
      contributor,
      blockNumber: this.block.height,
      extrinsicHash: this.extrinsic?.hash,
      timestamp: new Date(this.block.timestamp ?? 0),
    });

    contributor.totalContributed += this.data.amount;
    crowdloan.raised += this.data.amount;

    await ctx.store.insert(contribution);
    await ctx.store.upsert(contributor);
    await ctx.store.upsert(crowdloan);
  }
}
