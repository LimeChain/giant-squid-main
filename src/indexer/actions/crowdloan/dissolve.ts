import { Crowdloan, CrowdloanStatus } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface DissolveCrowdloanData {
  crowdloan: () => Promise<Crowdloan>;
}

export class DissolveCrowdloanAction extends Action<DissolveCrowdloanData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const crowdloan = await this.data.crowdloan();

    crowdloan.status = CrowdloanStatus.Dissolved;

    await ctx.store.upsert(crowdloan);
  }
}
