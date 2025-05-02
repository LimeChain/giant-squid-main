import { NominationPoolsPaidOut, Pool, Staker } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface BondData {
  id: string;
  payout: bigint;
  staker: () => Promise<Staker>;
  pool: () => Promise<Pool>;
}

export class NominationPoolsPaidOutAction extends Action<BondData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const staker = await this.data.staker();
    const pool = await this.data.pool();

    if (!staker || !pool) {
      return;
    }

    const paidOut = new NominationPoolsPaidOut({
      id: this.composeId(this.data.id),
      blockNumber: this.block.height,
      extrinsicHash: this.extrinsic?.hash,
      member: staker,
      payout: this.data.payout,
      pool,
    });

    await ctx.store.upsert(paidOut);
    await ctx.store.upsert(staker);
    await ctx.store.upsert(pool);
  }
}
