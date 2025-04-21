// @ts-ignore
import { Account, BondingType, NominationPoolsUnbound, Pool, Staker, StakingBond } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface UnbondPoolData {
  id: string;
  balance: bigint;
  points: bigint;
  era: number;
  pool: () => Promise<Pool>;
  staker: () => Promise<Staker>;
}

export class UnbondPoolAction extends Action<UnbondPoolData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const staker = await this.data.staker();
    const pool = await this.data.pool();

    const bond = new NominationPoolsUnbound({
      id: this.composeId(this.data.id, staker.id, this.extrinsic?.hash),
      blockNumber: this.block.height,
      extrinsicHash: this.extrinsic?.hash,
      balance: this.data.balance,
      points: this.data.points,
      era: this.data.era,
      staker,
      pool,
    });

    staker.activeBonded -= this.data.balance;
    staker.totalUnbonded += this.data.balance;
    staker.pool = null;

    if (pool.totalBonded != null) {
      pool.totalBonded -= this.data.balance;
    }

    await ctx.store.insert(bond);
    await ctx.store.upsert(staker);
    await ctx.store.upsert(pool);
  }
}
