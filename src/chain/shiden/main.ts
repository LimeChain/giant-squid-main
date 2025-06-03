import { ensureEnvVariable } from '@/utils';
import { Indexer, setupPallet } from '@/indexer';
import { ReserveTransferAssetsCallDecoder } from '@/chain/shiden/decoders/calls/reserveTransferAssets';
import { LimitedReserveTransferAssetsCallDecoder } from '@/chain/shiden/decoders/calls/limitedReserveTransferAssets';
import { TransferredAssetsEventPalletDecoder } from '@/chain/shiden/decoders/events/xTokens/transferredAssets';
import { TransferEventPalletDecoder } from '@/chain/shiden/decoders/events/balances/transfer';
import { TransferredMultiAssetsEventPalletDecoder } from '@/chain/shiden/decoders/events/xTokens/transferredMultiAssets';

export const indexer = new Indexer({
  config: {
    prefix: 5,
    chain: ensureEnvVariable('CHAIN'),
    endpoint: ensureEnvVariable('CHAIN_RPC_ENDPOINT'),
  },
  pallets: {
    calls: {
      'PolkadotXcm.reserve_transfer_assets': setupPallet({ decoder: new ReserveTransferAssetsCallDecoder() }),
      'PolkadotXcm.limited_reserve_transfer_assets': setupPallet({ decoder: new LimitedReserveTransferAssetsCallDecoder() }),
    },
    events: {
      'Balances.Transfer': setupPallet({ decoder: new TransferEventPalletDecoder() }),
      'XTokens.TransferredAssets': setupPallet({ decoder: new TransferredAssetsEventPalletDecoder() }),
      'XTokens.TransferredMultiAssets': setupPallet({ decoder: new TransferredMultiAssetsEventPalletDecoder() }),
    },
  },
});
