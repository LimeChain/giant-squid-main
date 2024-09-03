import { Account, ParachainStakingDelegationDecreased, Staker } from '@/model';
import { Action, ActionContext } from '../base';

interface ParachainDelegationDecreasedData {
  id: string;
  amount: bigint;
  account: () => Promise<Account>;
  delegator: () => Promise<Account>;
  staker: () => Promise<Staker>;
  extrinsicHash: string;
}

export class ParachainDelegationDecreasedAction extends Action<ParachainDelegationDecreasedData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const account = await this.data.account();
    const delegator = await this.data.delegator();
    const staker = await this.data.staker();

    const delegationDecreased = new ParachainStakingDelegationDecreased({
      id: this.data.id,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      extrinsicHash: this.data.extrinsicHash,
      account: account,
      delegator: delegator,
      staker: staker,
      amount: this.data.amount,
    });

    staker.totalUnbonded += this.data.amount;

    await ctx.store.insert(delegationDecreased);
    await ctx.store.upsert(staker);
  }
}
