import { Account, ParachainStakingCandidatesWithdraw, Staker } from '@/model';
import { Action, ActionContext } from '../base';

interface ParachainCandidateLeftData {
  id: string;
  amount: bigint;
  account: () => Promise<Account>;
  staker: () => Promise<Staker>;
  extrinsicHash: string;
}

export class ParachainCandidateLeftAction extends Action<ParachainCandidateLeftData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const account = await this.data.account();
    const staker = await this.data.staker();

    const candidateUnbondAndWithdraw = new ParachainStakingCandidatesWithdraw({
      id: this.data.id,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      extrinsicHash: this.data.extrinsicHash,
      account: account,
      staker: staker,
      amount: this.data.amount,
    });

    staker.totalUnbonded += this.data.amount;
    staker.totalWithdrawn += this.data.amount;

    await ctx.store.insert(candidateUnbondAndWithdraw);
    await ctx.store.upsert(staker);
  }
}
