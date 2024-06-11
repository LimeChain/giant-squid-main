import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'karura',
    endpoint: 'wss://karura-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/karura',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
