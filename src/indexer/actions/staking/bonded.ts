// @ts-ignore
import { Account, BondingType, Staker, StakingBond } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface BondData {
  id: string;
  type: BondingType;
  amount: bigint;
  account: () => Promise<Account>;
  staker: () => Promise<Staker>;
}

export class BondAction extends Action<BondData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const account = await this.data.account();
    const staker = await this.data.staker();

    const bond = new StakingBond({
      id: this.composeId(this.data.id, staker.id, this.extrinsic?.hash),
      type: this.data.type,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      extrinsicHash: this.extrinsic?.hash,
      account: account,
      staker: staker,
      amount: this.data.amount,
    });

    staker.activeBonded += this.data.amount;
    staker.totalBonded += this.data.amount;

    await ctx.store.insert(bond);
    await ctx.store.upsert(staker);
  }
}
