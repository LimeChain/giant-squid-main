import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'litentry',
    endpoint: 'wss://litentry-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/litentry',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
