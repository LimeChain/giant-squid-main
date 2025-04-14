import { ConvictionUnlock } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface UnlockConvictionVotingData {
  id: string;
  class: number;
  target: string | undefined;
}

export class UnlockConvictionVotingAction extends Action<UnlockConvictionVotingData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const unlock = new ConvictionUnlock({
      id: this.data.id,
      class: this.data.class,
      target: this.data.target,
    });

    await ctx.store.upsert(unlock);
  }
}
