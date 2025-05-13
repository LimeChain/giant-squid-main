import { ensureEnvVariable } from '@/utils';
import { Indexer, setupPallet } from '@/indexer';
import { TransferEventPalletDecoder } from '@/chain/astar/decoders/events/balances/transfer';
import { SUBSQUID_NETWORK_URL } from '@/utils/constants';
import { SentEventPalletDecoder } from '@/chain/astar/decoders/events/polkadotXcm/sent';
import { TransferredMultiAssetsEventPalletDecoder } from '@/chain/astar/decoders/events/xTokens/transferredMultiAssets';
import { TransferredAssetsEventPalletDecoder } from '@/chain/astar/decoders/events/xTokens/transferredAssets';

export const indexer = new Indexer({
  config: {
    chain: ensureEnvVariable('CHAIN'),
    endpoint: ensureEnvVariable('CHAIN_RPC_ENDPOINT'),
    gateway: `${SUBSQUID_NETWORK_URL}/astar-substrate`,
  },
  pallets: {
    events: {
      'Balances.Transfer': setupPallet({ decoder: new TransferEventPalletDecoder() }),
      'PolkadotXcm.Sent': setupPallet({ decoder: new SentEventPalletDecoder() }),
      'XTokens.TransferredAssets': setupPallet({ decoder: new TransferredAssetsEventPalletDecoder() }),
      'XTokens.TransferredMultiAssets': setupPallet({ decoder: new TransferredMultiAssetsEventPalletDecoder() }),
    },
  },
});
