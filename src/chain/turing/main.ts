import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'turing',
    endpoint: 'wss://turing-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/turing',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
