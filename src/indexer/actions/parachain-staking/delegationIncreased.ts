import { Account, ParachainStakingDelegationIncreased, Staker } from '@/model';
import { Action, ActionContext } from '../base';

interface ParachainDelegationIncreasedData {
  id: string;
  amount: bigint;
  account: () => Promise<Account>;
  delegator: () => Promise<Account>;
  staker: () => Promise<Staker>;
  extrinsicHash: string;
}

export class ParachainDelegationIncreasedAction extends Action<ParachainDelegationIncreasedData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const account = await this.data.account();
    const delegator = await this.data.delegator();
    const staker = await this.data.staker();

    const delegationIncreased = new ParachainStakingDelegationIncreased({
      id: this.data.id,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      extrinsicHash: this.data.extrinsicHash,
      account: account,
      delegator: delegator,
      staker: staker,
      amount: this.data.amount,
    });

    staker.totalBonded += this.data.amount;

    await ctx.store.insert(delegationIncreased);
    await ctx.store.upsert(staker);
  }
}
