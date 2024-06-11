import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'amplitude',
    endpoint: 'wss://amplitude-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/amplitude',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
},
});
