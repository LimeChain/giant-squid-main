import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'moonriver',
    endpoint: 'wss://moonriver-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/moonriver',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
