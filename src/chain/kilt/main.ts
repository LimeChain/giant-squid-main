import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'kilt',
    endpoint: 'wss://kilt-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/kilt',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
