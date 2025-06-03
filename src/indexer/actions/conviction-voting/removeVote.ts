// @ts-ignore
import { Account, ConvictionRemoveVote } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface RemoveVoteConvictionVotingData {
  id: string;
  extrinsicHash: string | undefined;
  who: () => Promise<Account>;
  index: number;
  class: number | undefined;
}

export class RemoveVoteConvictionVotingAction extends Action<RemoveVoteConvictionVotingData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const who = await this.data.who?.();

    const removeVote = new ConvictionRemoveVote({
      id: this.data.id,
      extrinsicHash: this.data.extrinsicHash,
      who,
      index: this.data.index,
      class: this.data.class,
    });

    await ctx.store.upsert(removeVote);
  }
}
