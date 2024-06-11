import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'pendulum',
    endpoint: 'wss://pendulum-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/pendulum',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
