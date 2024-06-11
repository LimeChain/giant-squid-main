import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'bifrost-polkadot',
    endpoint: 'wss://bifrost-polkadot-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/bifrost-polkadot',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
