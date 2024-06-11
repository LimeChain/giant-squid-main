import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'litmus',
    endpoint: 'wss://litmus-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/litmus',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
