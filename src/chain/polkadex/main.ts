import { createIndexer } from '../../main';
import { TransferEventPalletDecoder } from '../../indexer/pallets/balances/events/transfer';
import { StakingRewardEventPalletDecoder } from '../../indexer/pallets/staking/events/staking';

//TODO Implement the calls: payout_stakers
createIndexer({
  config: {
    chain: 'polkadex',
    endpoint: 'wss://polkadex-rpc.dwellir.com',
    gateway: 'https://v2.archive.subsquid.io/network/polkadex',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
      'Staking.Rewarded': new StakingRewardEventPalletDecoder(),
    },
  },
});
