import { ensureEnvVariable } from '@/utils';
import { Indexer, setupPallet } from '@/indexer';
import { TransferEventPalletDecoder } from '@/chain/centrifuge/decoders/events/balances/transfer';
import { TransferredMultiAssetsEventPalletDecoder } from '@/chain/centrifuge/decoders/events/xTokens/transferredMultiAssets';
import { TransferredAssetsEventPalletDecoder } from '@/chain/centrifuge/decoders/events/ormlXTokens/transferredAssets';
import { TransferredMultiAssetsEventPalletDecoder as TransferredMultiAssetsEventPalletDecoderOrml } from '@/chain/centrifuge/decoders/events/ormlXTokens/transferredMultiAssets';

export const indexer = new Indexer({
  config: {
    chain: ensureEnvVariable('CHAIN'),
    endpoint: ensureEnvVariable('CHAIN_RPC_ENDPOINT'),
  },
  pallets: {
    events: {
      'Balances.Transfer': setupPallet({ decoder: new TransferEventPalletDecoder() }),
      'XTokens.TransferredMultiAssets': setupPallet({ decoder: new TransferredMultiAssetsEventPalletDecoder() }),
      'OrmlXTokens.TransferredAssets': setupPallet({ decoder: new TransferredAssetsEventPalletDecoder() }),
      'OrmlXTokens.TransferredMultiAssets': setupPallet({ decoder: new TransferredMultiAssetsEventPalletDecoderOrml() }),
    },
  },
});
