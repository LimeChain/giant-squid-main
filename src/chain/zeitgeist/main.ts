import { createIndexer } from '../../indexer';
import { ensureEnvVariable } from '../../utils';
import { TransferEventPalletDecoder } from './decoders/events/balances/transfer';

createIndexer({
  config: {
    chain: ensureEnvVariable('CHAIN'),
    endpoint: ensureEnvVariable('CHAIN_RPC_ENDPOINT'),
    typesBundle: './type-bundles/zeitgeist.json',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
