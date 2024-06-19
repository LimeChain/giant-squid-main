import { ensureEnvVariable } from '../../utils';
import { createIndexer, setupPallet } from '../../indexer';
import { AddSubCallPalletDecoder } from './decoders/calls/identities/addSub';
import { SetSubsCallPalletDecoder } from './decoders/calls/identities/setSubs';
import { TransferEventPalletDecoder } from './decoders/events/balances/transfer';
import { StakingRewardEventPalletDecoder } from './decoders/events/staking/reward';
import { SetIdentityCallPalletDecoder } from './decoders/calls/identities/setIdentity';
import { PayoutStakersCallPalletDecoder } from './decoders/calls/staking/payoutStakers';
import { RenameIdentityCallPalletDecoder } from './decoders/calls/identities/renameIdentity';
import { ProvideJudgementCallPalletDecoder } from './decoders/calls/identities/provideJudgement';

createIndexer({
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
