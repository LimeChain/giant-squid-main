// @ts-ignore
import { Account, ParachainStakingDelegation, Staker } from '@/model';
import { Action, ActionContext } from '../base';

interface ParachainDelegationData {
  id: string;
  amount: bigint;
  account: () => Promise<Account>;
  delegator: () => Promise<Account>;
  staker: () => Promise<Staker>;
  extrinsicHash: string;
  delegatorPosition: string;
  autoCompundPercent?: number;
}

export class ParachainDelegationAction extends Action<ParachainDelegationData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const account = await this.data.account();
    const delegator = await this.data.delegator();
    const staker = await this.data.staker();

    const delegation = new ParachainStakingDelegation({
      id: this.data.id,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      extrinsicHash: this.data.extrinsicHash,
      account: account,
      delegator: delegator,
      staker: staker,
      amount: this.data.amount,
      delegatorPosition: this.data.delegatorPosition,
      autoCompundPercent: this.data.autoCompundPercent ?? 0,
    });

    staker.totalBonded += this.data.amount;

    await ctx.store.insert(delegation);
    await ctx.store.upsert(staker);
  }
}
