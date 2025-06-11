import { ensureEnvVariable } from '@/utils/misc';
import { Indexer, setupPallet } from '@/indexer';
import { CreatedEventPalletDecoder } from '@/chain/asset-hub-polkadot/decoders/events/nfts/created';
import { CollectionMetadataSetEventPalletDecoder } from '@/chain/asset-hub-polkadot/decoders/events/nfts/collectionMetadataSet';
import { CollectionOwnerChangeEventPalletDecoder } from '@/chain/asset-hub-polkadot/decoders/events/nfts/collectionOwnerChange';
import { TokenIssuedEventPalletDecoder } from '@/chain/asset-hub-polkadot/decoders/events/nfts/tokenIssued';
import { TokenMetadataSetEventPalletDecoder } from '@/chain/asset-hub-polkadot/decoders/events/nfts/tokenMetadataSet';
import { TokenBurnedEventPalletDecoder } from '@/chain/asset-hub-polkadot/decoders/events/nfts/burned';
import { TokenTransferredEventPalletDecoder } from '@/chain/asset-hub-polkadot/decoders/events/nfts/transferred';
import { AttributeSetEventPalletDecoder } from '@/chain/asset-hub-polkadot/decoders/events/nfts/tokenAttributeSet';
import { TransferEventPalletDecoder } from '@/chain/asset-hub-polkadot/decoders/events/balances/transfer';

export const indexer = new Indexer({
  config: {
    prefix: 0,
    chain: ensureEnvVariable('CHAIN'),
    endpoint: ensureEnvVariable('CHAIN_RPC_ENDPOINT'),
  },
  pallets: {
    events: {
      'Balances.Transfer': setupPallet({ decoder: new TransferEventPalletDecoder() }),
      'Nfts.Created': setupPallet({ decoder: new CreatedEventPalletDecoder() }),
      'Nfts.CollectionMetadataSet': setupPallet({ decoder: new CollectionMetadataSetEventPalletDecoder() }),
      'Nfts.OwnerChanged': setupPallet({ decoder: new CollectionOwnerChangeEventPalletDecoder() }),
      'Nfts.Issued': setupPallet({ decoder: new TokenIssuedEventPalletDecoder() }),
      'Nfts.ItemMetadataSet': setupPallet({ decoder: new TokenMetadataSetEventPalletDecoder() }),
      'Nfts.Burned': setupPallet({ decoder: new TokenBurnedEventPalletDecoder() }),
      'Nfts.Transferred': setupPallet({ decoder: new TokenTransferredEventPalletDecoder() }),
      'Nfts.AttributeSet': setupPallet({ decoder: new AttributeSetEventPalletDecoder() }),
    },
  },
});
