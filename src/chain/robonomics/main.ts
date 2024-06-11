import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'robonomics',
    endpoint: 'wss://robonomics-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/robonomics',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
