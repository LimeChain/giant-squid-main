import { createIndexer } from '../../main';
import { ensureEnvVariable } from '../../utils';
import { lookupArchive } from '@subsquid/archive-registry';
import { TransferEventPalletDecoder } from './decoders/events/balances';

createIndexer({
  config: {
    chain: ensureEnvVariable('CHAIN'),
    endpoint: ensureEnvVariable('CHAIN_RPC_ENDPOINT'),
    gateway: lookupArchive(ensureEnvVariable('CHAIN'), { release: 'ArrowSquid' }),
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
    },
  },
});
