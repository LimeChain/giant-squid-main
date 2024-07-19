import { ensureEnvVariable } from '@/utils';
import { Indexer, setupPallet } from '@/indexer';
import { TransferEventPalletDecoder } from '@/chain/polkadex/decoders/events/balances/transfer';
import { StakingRewardEventPalletDecoder } from '@/chain/polkadex/decoders/events/staking/reward';
import { PayoutStakersCallPalletDecoder } from '@/chain/polkadex/decoders/calls/staking/payoutStakers';

export const indexer = new Indexer({
  config: {
    chain: ensureEnvVariable('CHAIN'),
    endpoint: ensureEnvVariable('CHAIN_RPC_ENDPOINT'),
    typesBundle: 'assets/type-bundles/polkadex.json',
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
