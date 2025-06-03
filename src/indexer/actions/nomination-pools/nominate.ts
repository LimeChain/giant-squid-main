//@ts-ignore
import { NominationPoolsNominate, Pool } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface NominatePoolData {
  pool: () => Promise<Pool>;
  validators: string[];
}

export class NominatePoolAction extends Action<NominatePoolData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const pool = await this.data.pool();

    const nominate = new NominationPoolsNominate({
      id: this.composeId(this.extrinsic?.hash),
      blockNumber: this.block.height,
      extrinsicHash: this.extrinsic?.hash,
      pool: pool,
      validators: this.data.validators,
    });

    await ctx.store.upsert(nominate);
  }
}
