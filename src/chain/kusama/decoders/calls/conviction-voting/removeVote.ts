import { calls } from '@/chain/kusama/types';
import { Call, IRemoveVoteCallPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class RemoveVoteCallPalletDecoder implements IRemoveVoteCallPalletDecoder {
  decode(call: Call) {
    const { removeVote } = calls.convictionVoting;

    if (removeVote.v9320.is(call)) {
      const fund = removeVote.v9320.decode(call);

      return {
        class: fund.class,
        index: fund.index,
      };
    }

    throw new UnknownVersionError(removeVote);
  }
}
