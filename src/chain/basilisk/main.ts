import { ensureEnvVariable } from '@/utils';
import { Indexer, setupPallet } from '@/indexer';
import { TransferEventPalletDecoder } from '@/chain/basilisk/decoders/events/balances/transfer';
import { RemoveVoteCallPalletDecoder } from '@/chain/basilisk/decoders/calls/conviction-voting/removeVote';
import { UnlockCallPalletDecoder } from '@/chain/basilisk/decoders/calls/conviction-voting/unlock';
import { VoteCallPalletDecoder } from '@/chain/basilisk/decoders/calls/conviction-voting/vote';
import { TransferredAssetsEventPalletDecoder } from '@/chain/basilisk/decoders/events/xTokens/transferredAssets';
import { TransferredMultiAssetsEventPalletDecoder } from '@/chain/basilisk/decoders/events/xTokens/transferredMultiAssets';

export const indexer = new Indexer({
  config: {
    chain: ensureEnvVariable('CHAIN'),
    endpoint: ensureEnvVariable('CHAIN_RPC_ENDPOINT'),
  },
  pallets: {
    events: {
      'Balances.Transfer': setupPallet({ decoder: new TransferEventPalletDecoder() }),
      'XTokens.TransferredAssets': setupPallet({ decoder: new TransferredAssetsEventPalletDecoder() }),
      'XTokens.TransferredMultiAssets': setupPallet({ decoder: new TransferredMultiAssetsEventPalletDecoder() }),
    },
    calls: {
      'ConvictionVoting.unlock': setupPallet({ decoder: new UnlockCallPalletDecoder() }),
      'ConvictionVoting.vote': setupPallet({ decoder: new VoteCallPalletDecoder() }),
      'ConvictionVoting.remove_vote': setupPallet({ decoder: new RemoveVoteCallPalletDecoder() }),
    },
  },
});
