import { ensureEnvVariable } from '../../utils/misc';
import { Indexer, setupPallet } from '../../indexer';
import { TransferEventPalletDecoder } from './decoders/events/balances/transfer';

export const indexer = new Indexer({
    config: {
        chain: ensureEnvVariable('CHAIN'),
        endpoint: ensureEnvVariable('CHAIN_RPC_ENDPOINT'),
    },
    pallets: {
        events: {
            'Balances.Transfer': setupPallet({ decoder: new TransferEventPalletDecoder() }),
        },
    },
})