import { ConvictionVote, ConvictionVoteField } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface VoteConvictionVotingData {
  pollIndex: number;
  vote: {
    aye?: bigint;
    nay?: bigint;
    abstain?: bigint;
    vote?: number;
    balance?: bigint;
  };
}

export class VoteConvictionVotingAction extends Action<VoteConvictionVotingData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const vote = new ConvictionVote({
      id: this.extrinsic?.hash,
      pollIndex: this.data.pollIndex,
      vote: new ConvictionVoteField(this.data.vote),
    });

    await ctx.store.upsert(vote);
  }
}
