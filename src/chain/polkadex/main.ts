import { createIndexer } from '../../indexer';
import { ensureEnvVariable } from '../../utils';
import { TransferEventPalletDecoder } from './decoders/events/balances/transfer';
import { StakingRewardEventPalletDecoder } from './decoders/events/staking/reward';
import { PayoutStakersCallPalletDecoder } from './decoders/calls/staking/reward';

createIndexer({
  config: {
    chain: ensureEnvVariable('CHAIN'),
    endpoint: ensureEnvVariable('CHAIN_RPC_ENDPOINT'),
    typesBundle: './type-bundles/polkadex.json',
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
      'Staking.Rewarded': new StakingRewardEventPalletDecoder(),
    },
    calls: {
      'Staking.payout_stakers': new PayoutStakersCallPalletDecoder(),
    },
  },
});
