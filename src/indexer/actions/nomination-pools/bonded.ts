// @ts-ignore
import { NominationPoolsBond, Pool, Staker } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface BondData {
  id: string;
  type: string;
  amount: bigint;
  staker: () => Promise<Staker>;
  pool: () => Promise<Pool>;
}

export class NominationPoolsBondAction extends Action<BondData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const staker = await this.data.staker();
    const pool = await this.data.pool();

    if (!staker || !pool) {
      return;
    }

    const bond = new NominationPoolsBond({
      id: this.composeId(this.data.id),
      type: this.data.type,
      timestamp: new Date(this.block.timestamp ?? 0),
      blockNumber: this.block.height,
      extrinsicHash: this.extrinsic?.hash,
      amount: this.data.amount,
      staker,
      pool,
    });

    pool.totalBonded += this.data.amount;

    if (!pool.members?.includes(staker.id)) {
      pool.members.push(staker.id);
    }

    staker.pool = pool;

    await ctx.store.upsert(bond);
    await ctx.store.upsert(staker);
    await ctx.store.upsert(pool);
  }
}
