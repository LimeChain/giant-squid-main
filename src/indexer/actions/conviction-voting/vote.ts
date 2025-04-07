import { Account, ConvictionVote, ConvictionVoteField } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface VoteConvictionVotingData {
  id: string;
  extrinsicHash: string | undefined;
  who: () => Promise<Account>;
  pollIndex: number | undefined;
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
    const who = await this.data.who();

    const vote = new ConvictionVote({
      id: this.data.id,
      extrinsicHash: this.data.extrinsicHash,
      who,
      pollIndex: this.data.pollIndex,
      vote: new ConvictionVoteField(this.data.vote),
    });

    await ctx.store.upsert(vote);
  }
}
