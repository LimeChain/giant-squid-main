import { Crowdloan, CrowdloanContributor, CrowdloanReimbursement, CrowdloanReimbursementType } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface ReimburseCrowdloanData {
  id: string;
  amount: bigint;
  type: CrowdloanReimbursementType;
  contributor: () => Promise<CrowdloanContributor>;
  crowdloan: () => Promise<Crowdloan>;
}

export class ReimburseCrowdloanAction extends Action<ReimburseCrowdloanData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const crowdloan = await this.data.crowdloan();
    const contributor = await this.data.contributor();

    const contribution = new CrowdloanReimbursement({
      id: this.data.id,
      amount: this.data.amount,
      type: this.data.type,
      crowdloan,
      contributor,
      blockNumber: this.block.height,
      extrinsicHash: this.extrinsic?.hash,
      timestamp: new Date(this.block.timestamp ?? 0),
    });

    contributor.reimbursed = true;
    crowdloan.reimbursed += this.data.amount;

    await ctx.store.insert(contribution);
    await ctx.store.upsert(contributor);
    await ctx.store.upsert(crowdloan);
  }
}
