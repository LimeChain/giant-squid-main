import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'centrifuge',
    endpoint: 'wss://centrifuge-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/centrifuge',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
