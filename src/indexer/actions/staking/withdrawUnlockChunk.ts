import { StakingUnlockChunk } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface UpdateUnlockChunkData {
  chunkId: string;
  value: bigint;
}

export class WithdrawUnlockChunkAction extends Action<UpdateUnlockChunkData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const chunk = await ctx.store.get(StakingUnlockChunk, this.data.chunkId);

    if (chunk) {
      chunk.amount = this.data.value;

      await ctx.store.upsert(chunk);
    }
  }
}
