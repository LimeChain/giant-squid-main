import { Undelegate } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface UndelegateConvictionVotingData {
  class: number;
}

export class UndelegateConvictionVotingAction extends Action<UndelegateConvictionVotingData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const delegate = new Undelegate({
      id: this.extrinsic?.hash,
      class: this.data.class,
    });

    await ctx.store.upsert(delegate);
  }
}
