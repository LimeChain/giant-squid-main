//@ts-ignore
import { NominationPoolsUnbound, Pool, Staker } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface UnbondPoolData {
  id: string;
  balance?: bigint;
  points?: bigint;
  era?: number;
  pool: () => Promise<Pool>;
  staker: () => Promise<Staker>;
}

export class UnbondPoolAction extends Action<UnbondPoolData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const staker = await this.data.staker();
    const pool = await this.data.pool();

    const unbonded = new NominationPoolsUnbound({
      id: this.composeId(this.data.id, staker.id, this.extrinsic?.hash),
      blockNumber: this.block.height,
      extrinsicHash: this.extrinsic?.hash,
      balance: this.data.balance,
      points: this.data.points,
      era: this.data.era,
      staker,
      pool,
    });

    if (this.data.balance !== undefined && staker && pool) {
      staker.activeBonded -= this.data.balance;
      staker.totalUnbonded += this.data.balance;
      pool.totalBonded -= this.data.balance;
    }

    pool.members = pool.members.filter((member: Pool['members'][number]) => member !== staker.id);

    await ctx.store.insert(unbonded);
    await ctx.store.upsert(staker);
    await ctx.store.upsert(pool);
  }
}
