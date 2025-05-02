import { calls } from '@/chain/bifrost-polkadot/types';
import { Call, IRemoveVoteCallPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class RemoveVoteCallPalletDecoder implements IRemoveVoteCallPalletDecoder {
  decode(call: Call) {
    const { removeVote } = calls.convictionVoting;

    if (removeVote.v982.is(call)) {
      const fund = removeVote.v982.decode(call);

      return {
        index: fund.index,
        class: fund.class,
      };
    }

    throw new UnknownVersionError(removeVote);
  }
}
