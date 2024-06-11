import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';
import { StakingRewardEventPalletDecoder } from '../../indexer/pallets/staking/events/staking';

createIndexer({
  config: {
    chain: 'ternoa',
    endpoint: 'wss://ternoa-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/ternoa',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
      'Staking.Rewarded': new StakingRewardEventPalletDecoder(),
    },
  },
});
