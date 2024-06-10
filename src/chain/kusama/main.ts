import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';
import { SetIdentityCallPalletDecoder } from '../../indexer/pallets/identity/calls/identity';

createIndexer({
  config: {
    chain: 'kusama',
    endpoint: 'wss://kusama-rpc.polkadot.io',
    gateway: 'https://v2.archive.subsquid.io/network/kusama',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
    calls: {
      'Identity.set_identity': new SetIdentityCallPalletDecoder(),
    },
  },
});
