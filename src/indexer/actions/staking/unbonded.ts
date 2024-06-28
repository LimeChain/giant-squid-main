import { Account, Staker, StakingBond } from '../../../model';
import { Action, ActionContext } from '../base';

interface UnBondData {
  id: string;
  amount: bigint;
  account: () => Promise<Account>;
  staker: () => Promise<Staker>;
}

export class UnBondAction extends Action<UnBondData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const account = await this.data.account();
    const staker = await this.data.staker();

    const bond = new StakingBond({
      id: this.data.id,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      extrinsicHash: this.extrinsic?.hash,
      account: account,
      staker: staker,
      amount: -this.data.amount,
    });

    staker.totalBonded -= this.data.amount;
    staker.totalUnbonded += this.data.amount;

    await ctx.store.insert(bond);
    await ctx.store.upsert(staker);
  }
}
