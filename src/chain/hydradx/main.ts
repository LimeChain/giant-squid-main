import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'hydradx',
    endpoint: 'wss://hydradx-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/hydradx',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
