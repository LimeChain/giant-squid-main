import { ensureEnvVariable } from '@/utils';
import { Indexer, setupPallet } from '@/indexer';
import { TransferEventPalletDecoder } from '@/chain/integritee/decoders/events/balances/transfer';
import { SUBSQUID_NETWORK_URL } from '@/utils/constants';
import { SentEventPalletDecoder } from '@/chain/integritee/decoders/events/polkadotXcm/sent';
import { TransferredAssetsEventPalletDecoder } from '@/chain/integritee/decoders/events/xTokens/transferredAssets';
import { TransferredMultiAssetsEventPalletDecoder } from '@/chain/integritee/decoders/events/xTokens/transferredMultiAssets';

export const indexer = new Indexer({
  config: {
    chain: ensureEnvVariable('CHAIN'),
    endpoint: ensureEnvVariable('CHAIN_RPC_ENDPOINT'),
    gateway: `${SUBSQUID_NETWORK_URL}/integritee`,
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
