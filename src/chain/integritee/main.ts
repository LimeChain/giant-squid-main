import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';

createIndexer({
  config: {
    chain: 'integritee',
    endpoint: 'wss://integritee-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/integritee',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
