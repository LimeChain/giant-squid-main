// @ts-ignore
import { NominationPoolsWithdrawn, Pool, Staker } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface WithdrawnPoolData {
  id: string;
  balance: bigint;
  points?: bigint;
  pool: () => Promise<Pool>;
  staker: () => Promise<Staker>;
}

export class WithdrawnPoolAction extends Action<WithdrawnPoolData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const staker = await this.data.staker();
    const pool = await this.data.pool();

    const withdrawn = new NominationPoolsWithdrawn({
      id: this.composeId(this.data.id, staker.id, this.extrinsic?.hash),
      blockNumber: this.block.height,
      extrinsicHash: this.extrinsic?.hash,
      balance: this.data.balance,
      points: this.data.points,
      member: staker,
      pool,
    });

    await ctx.store.insert(withdrawn);
  }
}
