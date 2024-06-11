import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'darwinia',
    endpoint: 'wss://darwinia-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/darwinia',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
