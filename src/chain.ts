import { ITransferEventPalletDecoder } from "./indexer/pallets/mapper";
import { createIndexer } from "./main"
import { Event } from "./processor";

class TransferEventPalletDecoder implements ITransferEventPalletDecoder {
    decode(event: Event): { from: string; } {
        console.log('TransferEventPalletDecoder', event);
        return { from: '0x' };
    }
}

createIndexer({
    config: {
        chain: 'kusama',
        endpoint: 'wss://kusama-rpc.polkadot.io',
    },
    decoders: {
        events: {
            'Balances.Transfer': new TransferEventPalletDecoder()
        }
    }
})