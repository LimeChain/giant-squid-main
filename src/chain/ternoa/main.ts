import { ensureEnvVariable } from '../../utils';
import { createIndexer, setupPallet } from '../../indexer';
import { TransferEventPalletDecoder } from './decoders/events/balances/transfer';
import { StakingRewardEventPalletDecoder } from './decoders/events/staking/reward';
import { PayoutStakersCallPalletDecoder } from './decoders/calls/staking/payoutStakers';

createIndexer({
  config: {
    chain: ensureEnvVariable('CHAIN'),
    endpoint: ensureEnvVariable('CHAIN_RPC_ENDPOINT'),
  },
  pallets: {
    events: {
      'Balances.Transfer': setupPallet({ decoder: new TransferEventPalletDecoder() }),
      'Staking.Rewarded': setupPallet({
        decoder: new StakingRewardEventPalletDecoder(),
        payoutStakersDecoder: new PayoutStakersCallPalletDecoder(),
      }),
    },
  },
});
