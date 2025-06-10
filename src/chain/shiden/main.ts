import { ensureEnvVariable } from '@/utils';
import { Indexer, setupPallet } from '@/indexer';
import { TransferredAssetsEventPalletDecoder } from '@/chain/shiden/decoders/events/xTokens/transferredAssets';
import { TransferEventPalletDecoder } from '@/chain/shiden/decoders/events/balances/transfer';
import { TransferredMultiAssetsEventPalletDecoder } from '@/chain/shiden/decoders/events/xTokens/transferredMultiAssets';
import { SentEventPalletDecoder } from '@/chain/shiden/decoders/events/polkadotXcm/sent';

export const indexer = new Indexer({
  config: {
    prefix: 5,
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
  },
});
