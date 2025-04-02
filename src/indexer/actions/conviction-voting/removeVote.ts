import { ConvictionRemoveVote, ConvictionVoteField } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface RemoveVoteConvictionVotingData {
  class?: number;
  index: number;
}

export class RemoveVoteConvictionVotingAction extends Action<RemoveVoteConvictionVotingData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const removeVote = new ConvictionRemoveVote({
      id: this.extrinsic?.hash,
      class: this.data.class,
      index: this.data.index,
    });

    await ctx.store.upsert(removeVote);
  }
}
