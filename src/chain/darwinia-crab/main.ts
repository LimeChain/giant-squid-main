import { ensureEnvVariable } from '@/utils';
import { Indexer, setupPallet } from '@/indexer';
import { TransferEventPalletDecoder } from '@/chain/darwinia-crab/decoders/events/balances/transfer';
import { SUBSQUID_NETWORK_URL } from '@/utils/constants';
import { SentEventPalletDecoder } from '@/chain/darwinia-crab/decoders/events/polkadotXcm/sent';

export const indexer = new Indexer({
  config: {
    chain: ensureEnvVariable('CHAIN'),
    endpoint: ensureEnvVariable('CHAIN_RPC_ENDPOINT'),
    gateway: `${SUBSQUID_NETWORK_URL}/darwinia-crab`,
  },
  pallets: {
    events: {
      'Balances.Transfer': setupPallet({ decoder: new TransferEventPalletDecoder() }),
      'PolkadotXcm.Sent': setupPallet({ decoder: new SentEventPalletDecoder() }),
    },
  },
});
