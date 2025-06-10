import { ensureEnvVariable } from '@/utils';
import { Indexer, setupPallet } from '@/indexer';
import { TransferEventPalletDecoder } from '@/chain/karura/decoders/events/balances/transfer';
import { TransferredAssetsEventPalletDecoder } from '@/chain/karura/decoders/events/xTokens/transferredAssets';
import { TransferredMultiAssetsEventPalletDecoder } from '@/chain/karura/decoders/events/xTokens/transferredMultiAssets';

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
  },
});
