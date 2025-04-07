import { Account, ConvictionRemoveVote, ConvictionVoteField } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface RemoveVoteConvictionVotingData {
  id: string;
  extrinsicHash: string | undefined;
  who: () => Promise<Account>;
  class?: number;
  index?: number;
  vote: {
    aye?: bigint;
    nay?: bigint;
    balance?: bigint;
    vote?: number;
    abstain?: bigint;
  };
}

export class RemoveVoteConvictionVotingAction extends Action<RemoveVoteConvictionVotingData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const who = await this.data.who?.();

    const removeVote = new ConvictionRemoveVote({
      id: this.data.id,
      extrinsicHash: this.data.extrinsicHash,
      who,
      class: this.data.class,
      index: this.data.index ?? 0,
      vote: new ConvictionVoteField(this.data.vote),
    });

    await ctx.store.upsert(removeVote);
  }
}
