import { events } from '@/chain/polkadot/types';
import { Event, IVoteRemovedEventPalletDecoder } from '@/indexer';
import { DataNotDecodableError, UnknownVersionError } from '@/utils';

export class VoteRemovedEventPalletDecoder implements IVoteRemovedEventPalletDecoder {
  decode(call: Event) {
    const { voteRemoved } = events.convictionVoting;

    if (voteRemoved.v1004000.is(call)) {
      const fund = voteRemoved.v1004000.decode(call);
      let fundVote;

      switch (fund.vote.__kind) {
        case 'Split':
          fundVote = {
            aye: fund.vote.aye,
            nay: fund.vote.nay,
          };
          break;
        case 'Standard':
          fundVote = {
            vote: fund.vote.vote,
            balance: fund.vote.balance,
          };
          break;
        case 'SplitAbstain':
          fundVote = {
            aye: fund.vote.aye,
            nay: fund.vote.nay,
            abstain: fund.vote.abstain,
          };
          break;
        default:
          throw new DataNotDecodableError(voteRemoved, fund.vote);
      }

      return { who: fund.who, vote: fundVote };
    }

    throw new UnknownVersionError(voteRemoved);
  }
}
