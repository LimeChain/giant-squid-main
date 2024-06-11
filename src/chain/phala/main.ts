import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'phala',
    endpoint: 'wss://phala-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/phala',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
