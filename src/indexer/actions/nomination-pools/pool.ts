//@ts-ignore
import { Pool, PoolStatus, Staker } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

export interface CreatePoolData {
  creator: () => Promise<Staker>;
  root: () => Promise<Staker>;
  nominator: () => Promise<Staker>;
  toggler: () => Promise<Staker>;
  totalBonded: bigint;
}

export interface UpdatePoolData {
  pool: () => Promise<Pool>;
  name?: string;
  status?: PoolStatus;
  totalBonded?: bigint;
  root?: () => Promise<Staker>;
  nominator?: () => Promise<Staker>;
  toggler?: () => Promise<Staker>;
}

export class CreatePoolAction extends Action<CreatePoolData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const creator = await this.data.creator();
    const root = await this.data.root();
    const nominator = await this.data.nominator();
    const toggler = await this.data.toggler();
    const poolId = ((await ctx.store.count(Pool)) + 1).toString();

    const pool = new Pool({
      id: poolId,
      name: undefined,
      creator,
      root,
      nominator,
      toggler,
      status: PoolStatus.Open,
      totalBonded: this.data.totalBonded,
      members: [],
    });

    await ctx.store.insert(pool);
  }
}

export class UpdatePoolAction extends Action<UpdatePoolData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const pool = await this.data.pool();
    if (!pool) {
      return;
    }

    pool.name = this.data.name ?? pool.name;
    pool.status = this.data.status ?? pool.status;
    pool.totalBonded = this.data.totalBonded ?? pool.totalBonded;
    pool.root = this.data.root ? await this.data.root() : pool.root;
    pool.nominator = this.data.nominator ? await this.data.nominator() : pool.nominator;
    pool.toggler = this.data.toggler ? await this.data.toggler() : pool.toggler;

    await ctx.store.upsert(pool);
  }
}
