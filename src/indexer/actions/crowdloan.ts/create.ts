import { Account, BondingType, Crowdloan, CrowdloanStatus, Staker, StakingBond } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface CreateCrowdloanData {
  paraId: string;
  cap: bigint;
  end: number;
  firstPeriod: number;
  lastPeriod: number;
  manager: () => Promise<Account>;
}

export class CreateCrowdloanAction extends Action<CreateCrowdloanData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const manager = await this.data.manager();

    const crowdloan = new Crowdloan({
      id: this.data.paraId,
      manager: manager,
      cap: this.data.cap,
      status: CrowdloanStatus.Active,
      firstPeriod: this.data.firstPeriod,
      lastPeriod: this.data.lastPeriod,
      endBlock: this.data.end,
      startBlock: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      extrinsicHash: this.extrinsic?.hash,
    });

    // We use insert ot update because one crowdloan can be recreated multiple times
    // eg. create/dissolve/create
    await ctx.store.upsert(crowdloan);
  }
}
