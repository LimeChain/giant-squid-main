import { ensureEnvVariable } from '@/utils';
import { Indexer, setupPallet } from '@/indexer';
import { AddSubCallPalletDecoder } from '@/chain/kusama/decoders/calls/identities/addSub';
import { SetSubsCallPalletDecoder } from '@/chain/kusama/decoders/calls/identities/setSubs';
import { TransferEventPalletDecoder } from '@/chain/kusama/decoders/events/balances/transfer';
import { StakingRewardEventPalletDecoder } from '@/chain/kusama/decoders/events/staking/reward';
import { SetIdentityCallPalletDecoder } from '@/chain/kusama/decoders/calls/identities/setIdentity';
import { PayoutStakersCallPalletDecoder } from '@/chain/kusama/decoders/calls/staking/payoutStakers';
import { RenameIdentityCallPalletDecoder } from '@/chain/kusama/decoders/calls/identities/renameIdentity';
import { ProvideJudgementCallPalletDecoder } from '@/chain/kusama/decoders/calls/identities/provideJudgement';

export const indexer = new Indexer({
  config: {
    chain: ensureEnvVariable('CHAIN'),
    endpoint: ensureEnvVariable('CHAIN_RPC_ENDPOINT'),
  },
  pallets: {
    events: {
      'Balances.Transfer': setupPallet({ decoder: new TransferEventPalletDecoder() }),
      'Staking.Reward': setupPallet({
        decoder: new StakingRewardEventPalletDecoder(),
        payoutStakersDecoder: new PayoutStakersCallPalletDecoder(),
      }),
      'Staking.Rewarded': setupPallet({
        decoder: new StakingRewardEventPalletDecoder(),
        payoutStakersDecoder: new PayoutStakersCallPalletDecoder(),
      }),
    },
    calls: {
      'Identity.set_identity': setupPallet({ decoder: new SetIdentityCallPalletDecoder() }),
      'Identity.set_subs': setupPallet({ decoder: new SetSubsCallPalletDecoder() }),
      'Identity.provide_judgement': setupPallet({ decoder: new ProvideJudgementCallPalletDecoder() }),
      'Identity.add_sub': setupPallet({ decoder: new AddSubCallPalletDecoder() }),
      'Identity.rename_sub': setupPallet({ decoder: new RenameIdentityCallPalletDecoder() }),
    },
  },
});
