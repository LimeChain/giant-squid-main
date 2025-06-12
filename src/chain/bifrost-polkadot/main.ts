import { ensureEnvVariable } from '@/utils';
import { Indexer, setupPallet } from '@/indexer';
import { TransferEventPalletDecoder } from '@/chain/bifrost-polkadot/decoders/events/balances/transfer';
import { RemoveVoteCallPalletDecoder } from '@/chain/bifrost-polkadot/decoders/calls/conviction-voting/removeVote';
import { UnlockCallPalletDecoder } from '@/chain/bifrost-polkadot/decoders/calls/conviction-voting/unlock';
import { VoteCallPalletDecoder } from '@/chain/bifrost-polkadot/decoders/calls/conviction-voting/vote';
import { SentEventPalletDecoder } from '@/chain/bifrost-polkadot/decoders/events/polkadotXcm/sent';
import { TransferredAssetsEventPalletDecoder } from '@/chain/bifrost-polkadot/decoders/events/xTokens/transferredAssets';
import { TransferredMultiAssetsEventPalletDecoder } from '@/chain/bifrost-polkadot/decoders/events/xTokens/transferredMultiAssets';

export const indexer = new Indexer({
  config: {
    prefix: 6,
    chain: ensureEnvVariable('CHAIN'),
    endpoint: ensureEnvVariable('CHAIN_RPC_ENDPOINT'),
  },
  pallets: {
    events: {
      'Balances.Transfer': setupPallet({ decoder: new TransferEventPalletDecoder() }),
      'PolkadotXcm.Sent': setupPallet({ decoder: new SentEventPalletDecoder() }),
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
