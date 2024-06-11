import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'darwinia-crab',
    endpoint: 'wss://darwinia-crab-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/darwinia-crab',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
