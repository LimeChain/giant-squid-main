import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'acala',
    endpoint: 'wss://acala-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/acala',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
