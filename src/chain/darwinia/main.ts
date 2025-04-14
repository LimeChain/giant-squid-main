import { ensureEnvVariable } from '@/utils';
import { Indexer, setupPallet } from '@/indexer';
import { TransferEventPalletDecoder } from '@/chain/darwinia/decoders/events/balances/transfer';
import { UnlockCallPalletDecoder } from '@/chain/darwinia/decoders/calls/conviction-voting/unlock';
import { VoteCallPalletDecoder } from '@/chain/darwinia/decoders/calls/conviction-voting/vote';
import { RemoveVoteCallPalletDecoder } from '@/chain/darwinia/decoders/calls/conviction-voting/removeVote';

export const indexer = new Indexer({
  config: {
    chain: ensureEnvVariable('CHAIN'),
    endpoint: ensureEnvVariable('CHAIN_RPC_ENDPOINT'),
  },
  pallets: {
    events: {
      'Balances.Transfer': setupPallet({ decoder: new TransferEventPalletDecoder() }),
    },
    calls: {
      'ConvictionVoting.unlock': setupPallet({ decoder: new UnlockCallPalletDecoder() }),
      'ConvictionVoting.vote': setupPallet({ decoder: new VoteCallPalletDecoder() }),
      'ConvictionVoting.remove_vote': setupPallet({ decoder: new RemoveVoteCallPalletDecoder() }),
    },
  },
});
