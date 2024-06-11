import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'khala',
    endpoint: 'wss://khala-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/khala',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
