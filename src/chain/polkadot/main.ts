import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';
import { StakingRewardEventPalletDecoder } from '../../indexer/pallets/staking/events/staking';

createIndexer({
  config: {
    chain: 'polkadot',
    endpoint: 'wss://rpc.polkadot.io',
    gateway: 'https://v2.archive.subsquid.io/network/polkadot',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
      'Staking.Reward': new StakingRewardEventPalletDecoder(),
      'Staking.Rewarded': new StakingRewardEventPalletDecoder(),
    },
  },
});
