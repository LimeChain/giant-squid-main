import { Pool, PoolStatus } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

export interface PoolData {
  id: string;
  name?: string;
  stash?: string;
  reward?: string;
  creator?: string;
  root?: string;
  toggler?: string;
  nominator?: string;
  totalBonded?: bigint;
  status?: PoolStatus;
}

export class EnsurePool extends Action<PoolData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const pool = new Pool({
      id: this.data.id,
      name: this.data.name,
      stash: this.data.stash,
      reward: this.data.reward,
      creator: this.data.creator,
      root: this.data.root,
      toggler: this.data.toggler,
      nominator: this.data.nominator,
      totalBonded: this.data.totalBonded,
      status: this.data.status ?? PoolStatus.Open,
    });

    await ctx.store.upsert(pool);
  }
}
