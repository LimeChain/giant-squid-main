import { Account, Crowdloan, CrowdloanContributor } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface EnsureCrowdloanContributorData {
  id: string;
  contributor: () => Promise<CrowdloanContributor | undefined>;
  crowdloan: () => Promise<Crowdloan>;
  account: () => Promise<Account>;
}

export class EnsureCrowdloanContributorAction extends Action<EnsureCrowdloanContributorData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const contributor = await this.data.contributor();
    const account = await this.data.account();
    const crowdloan = await this.data.crowdloan();

    if (contributor) return;

    const crowdloanContributor = new CrowdloanContributor({
      id: this.data.id,
      totalContributed: BigInt(0),
      reimbursed: false,
      account,
      crowdloan,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
    });

    await ctx.store.insert(crowdloanContributor);
  }
}

interface MarkCrowdloanContributorAsReimbursedData {
  contributor: () => Promise<CrowdloanContributor>;
}

export class MarkCrowdloanContributorAsReimbursedAction extends Action<MarkCrowdloanContributorAsReimbursedData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const contributor = await this.data.contributor();

    contributor.reimbursed = true;

    await ctx.store.upsert(contributor);
  }
}
