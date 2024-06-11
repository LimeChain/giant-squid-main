import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'clover',
    endpoint: 'wss://clover-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/clover',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
