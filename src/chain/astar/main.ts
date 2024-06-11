import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'astar',
    endpoint: 'wss://astar-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/astar',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
