import { Account, Unlock } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface UnlockConvictionVotingData {
  class: number;
  target: string | undefined;
}

export class UnlockConvictionVotingAction extends Action<UnlockConvictionVotingData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const unlock = new Unlock({
      id: this.extrinsic?.hash,
      class: this.data.class,
      target: this.data.target,
    });

    await ctx.store.upsert(unlock);
  }
}
