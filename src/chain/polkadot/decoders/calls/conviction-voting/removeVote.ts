import { calls } from '@/chain/polkadot/types';
import { Call, IRemoveVoteCallPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class RemoveVoteCallPalletDecoder implements IRemoveVoteCallPalletDecoder {
  decode(call: Call) {
    const { removeVote } = calls.convictionVoting;

    if (removeVote.v9420.is(call)) {
      const fund = removeVote.v9420.decode(call);

      return {
        index: fund.index,
        class: fund.class,
      };
    }

    throw new UnknownVersionError(removeVote);
  }
}
