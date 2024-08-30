import { Account, ParachainStakingCandidateBond, Staker } from '@/model';
import { Action, ActionContext } from '../base';

interface ParachainCandidateBondedMoreData {
  id: string;
  amount: bigint;
  account: () => Promise<Account>;
  staker: () => Promise<Staker>;
  extrinsicHash: string;
}

export class ParachainCandidateBondedMoreAction extends Action<ParachainCandidateBondedMoreData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const account = await this.data.account();
    const staker = await this.data.staker();

    const candidateBondedMore = new ParachainStakingCandidateBond({
      id: this.data.id,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      extrinsicHash: this.data.extrinsicHash,
      account: account,
      staker: staker,
      amount: this.data.amount,
    });

    staker.totalBonded += this.data.amount;

    await ctx.store.insert(candidateBondedMore);
    await ctx.store.upsert(staker);
  }
}
