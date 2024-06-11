import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'shiden',
    endpoint: 'wss://shiden-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/shiden',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
