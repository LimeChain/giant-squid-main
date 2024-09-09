// @ts-ignore
import { Account, ParachainStakingCompound, Staker } from '@/model';
import { Action, ActionContext } from '../base';

interface ParachainCompoundData {
  id: string;
  amount: bigint;
  account: () => Promise<Account>;
  delegator: () => Promise<Account>;
  staker: () => Promise<Staker>;
  extrinsicHash: string;
}

export class ParachainCompoundAction extends Action<ParachainCompoundData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const account = await this.data.account();
    const delegator = await this.data.delegator();
    const staker = await this.data.staker();

    const compound = new ParachainStakingCompound({
      id: this.data.id,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      extrinsicHash: this.data.extrinsicHash,
      account: account,
      delegator: delegator,
      staker: staker,
      amount: this.data.amount,
    });

    staker.totalRewarded += this.data.amount;

    await ctx.store.insert(compound);
    await ctx.store.upsert(staker);
  }
}
