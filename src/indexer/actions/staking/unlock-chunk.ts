import { Staker, StakingUnlockChunk } from '../../../model';
import { Action, ActionContext } from '../base';

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
      id: this.data.id,
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
