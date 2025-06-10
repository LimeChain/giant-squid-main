import { ensureEnvVariable } from '@/utils/misc';
import { Indexer, setupPallet } from '@/indexer';
import { TransferEventPalletDecoder } from '@/chain/acala/decoders/events/balances/transfer';
import { TransferredAssetsEventPalletDecoder } from '@/chain/acala/decoders/events/xTokens/transferredAssets';
import { TransferredMultiAssetsEventPalletDecoder } from '@/chain/acala/decoders/events/xTokens/transferredMultiAssets';

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
