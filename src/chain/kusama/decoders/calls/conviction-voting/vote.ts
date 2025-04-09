import { calls } from '@/chain/kusama/types';
import { Call, IVoteCallPalletDecoder } from '@/indexer';
import { DataNotDecodableError, UnknownVersionError } from '@/utils';

export class VoteCallPalletDecoder implements IVoteCallPalletDecoder {
  decode(call: Call) {
    const { vote } = calls.convictionVoting;
    let fundVote;

    if (vote.v9340.is(call)) {
      const fund = vote.v9340.decode(call);

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
          throw new DataNotDecodableError(vote, fund.vote);
      }

      return {
        pollIndex: fund.pollIndex,
        vote: fundVote,
      };
    } else if (vote.v9320.is(call)) {
      const fund = vote.v9340.decode(call);

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
          throw new DataNotDecodableError(vote, fund.vote);
      }

      return {
        pollIndex: fund.pollIndex,
        vote: fundVote,
      };
    }

    throw new UnknownVersionError(vote);
  }
}
