import { calls } from '@/chain/moonriver/types';
import { Call, IRemoveVoteCallPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class RemoveVoteCallPalletDecoder implements IRemoveVoteCallPalletDecoder {
  decode(call: Call) {
    const { removeVote } = calls.convictionVoting;

    if (removeVote.v2100.is(call)) {
      const fund = removeVote.v2100.decode(call);

      return {
        index: fund.index,
        class: fund.class,
      };
    }

    throw new UnknownVersionError(removeVote);
  }
}
