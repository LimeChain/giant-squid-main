import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'moonbeam',
    endpoint: 'wss://moonbeam-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/moonbeam',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
