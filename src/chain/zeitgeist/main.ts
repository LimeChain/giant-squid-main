import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'zeitgeist',
    endpoint: 'wss://zeitgeist-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/zeitgeist',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
