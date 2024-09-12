// @ts-ignore
import { Staker, StakingUnlockChunk } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface UnlockChunkData {
  id: string;
  amount: bigint;
  lockedUntilEra: number;
  staker: () => Promise<Staker>;
}

export class UnlockChunkAction extends Action<UnlockChunkData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const staker = await this.data.staker();

    const chunk = new StakingUnlockChunk({
      id: this.data.id + this.extrinsic?.hash,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      staker: staker,
      amount: this.data.amount,
      lockedUntilEra: this.data.lockedUntilEra,
      withdrawn: false,
    });

    await ctx.store.insert(chunk);
  }
}

interface DecreaseUnlockChunkData {
  amount: bigint;
  chunk: () => Promise<StakingUnlockChunk>;
  staker: () => Promise<Staker>;
}

export class DecreaseUnlockChunkAction extends Action<DecreaseUnlockChunkData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const chunk = await this.data.chunk();
    const staker = await this.data.staker();

    chunk.amount -= this.data.amount;

    if (chunk.amount <= 0n) {
      chunk.withdrawn = true;
    }

    staker.totalUnbonded -= this.data.amount;

    await ctx.store.upsert(chunk);
    await ctx.store.upsert(staker);
  }
}

interface UpdateUnlockChunkData {
  chunk: () => Promise<StakingUnlockChunk>;
}

export class WithdrawUnlockChunkAction extends Action<UpdateUnlockChunkData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const chunk = await this.data.chunk();

    chunk.withdrawn = true;

    await ctx.store.upsert(chunk);
  }
}
