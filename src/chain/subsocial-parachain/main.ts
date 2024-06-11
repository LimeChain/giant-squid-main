import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'subsocial-parachain',
    endpoint: 'wss://subsocial-parachain-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/subsocial-parachain',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
