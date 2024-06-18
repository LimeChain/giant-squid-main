import { ensureEnvVariable } from '../../utils';
import { createIndexer, setupPallet } from '../../indexer';
import { TransferEventPalletDecoder } from './decoders/events/balances/transfer';

createIndexer({
  config: {
    chain: ensureEnvVariable('CHAIN'),
    endpoint: ensureEnvVariable('CHAIN_RPC_ENDPOINT'),
    typesBundle: './type-bundles/zeitgeist.json',
  },
  pallets: {
    events: {
      'Balances.Transfer': setupPallet({ decoder: new TransferEventPalletDecoder() }),
    },
  },
});
