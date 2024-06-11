import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'basilisk',
    endpoint: 'wss://basilisk-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/basilisk',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
