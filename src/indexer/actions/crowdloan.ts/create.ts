import { Crowdloan, CrowdloanStatus, Parachain } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface CreateCrowdloanData {
  id: string;
  cap: bigint;
  end: number;
  firstPeriod: number;
  lastPeriod: number;
  parachain: () => Promise<Parachain>;
}

export class CreateCrowdloanAction extends Action<CreateCrowdloanData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const parachain = await this.data.parachain();

    const crowdloan = new Crowdloan({
      id: this.data.id,
      parachain,
      status: CrowdloanStatus.Active,
      raised: 0n,
      cap: this.data.cap,
      leasePeriodStart: this.data.firstPeriod,
      leasePeriodEnd: this.data.lastPeriod,
      endBlock: this.data.end,
      startBlock: this.block.height,
    });

    await ctx.store.insert(crowdloan);
  }
}
