import { Account, Crowdloan, CrowdloanContribution, CrowdloanStatus, Parachain } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface ContributeCrowdloanData {
  id: string;
  amount: bigint;
  account: () => Promise<Account>;
  crowdloan: () => Promise<Crowdloan>;
}

export class ContributeCrowdloanAction extends Action<ContributeCrowdloanData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const crowdloan = await this.data.crowdloan();
    const account = await this.data.account();

    const contribution = new CrowdloanContribution({
      id: this.data.id,
      amount: this.data.amount,
      crowdloan,
      account,
      blockNumber: this.block.height,
      extrinsicHash: this.extrinsic?.hash,
      timestamp: new Date(this.block.timestamp ?? 0),
    });

    await ctx.store.insert(contribution);
  }
}

interface IncreaseCrowdloanRaisedFundsData {
  amount: bigint;
  crowdloan: () => Promise<Crowdloan>;
}

export class IncreaseCrowdloanRaisedFundsAction extends Action<IncreaseCrowdloanRaisedFundsData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const crowdloan = await this.data.crowdloan();

    crowdloan.raised += this.data.amount;

    await ctx.store.upsert(crowdloan);
  }
}
