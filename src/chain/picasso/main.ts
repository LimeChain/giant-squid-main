import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'picasso',
    endpoint: 'wss://picasso-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/picasso',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
