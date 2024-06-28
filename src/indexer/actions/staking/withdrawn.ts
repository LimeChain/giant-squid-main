import { Staker, StakingUnlockChunk } from '../../../model';
import { Action, ActionContext } from '../base';

interface WithdrawnData {
  id: string;
  amount: bigint;
  lockedUntilEra: number;
  currentEra: number;
  staker: () => Promise<Staker>;
}

export class WithdrawnAction extends Action<WithdrawnData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const staker = await this.data.staker();

    const chunk = new StakingUnlockChunk({
      id: this.data.id,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      staker: staker,
      amount: this.data.amount,
      lockedUntilEra: this.data.lockedUntilEra,
      withdrawn: true,
    });

    staker.totalUnbonded -= this.data.amount;
    staker.totalWithdrawn += this.data.amount;

    if (staker.unlockings) {
      const widrawable = staker.unlockings.filter((c) => c.lockedUntilEra <= this.data.currentEra);

      let chunkSum = 0n;
      for (const chunk of widrawable) {
        chunkSum += chunk.amount;
      }

      if (staker.totalBonded <= 0n && staker.totalUnbonded <= 0n && staker.totalWithdrawn === chunkSum) {
        console.log(staker, 'staker');
        // TODO: add status schema and change to idle or unknown
        // await ctx.store.remove(staker);
      }
    }
    await ctx.store.insert(chunk);
    await ctx.store.upsert(staker);
  }
}
