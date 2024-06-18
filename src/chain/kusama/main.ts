import { createIndexer, setupPallet } from '../../indexer';
import { ensureEnvVariable } from '../../utils';
import { TransferEventPalletDecoder } from './decoders/events/balances/transfer';
import { StakingRewardEventPalletDecoder } from './decoders/events/staking/reward';
import { IdentitySetSubsCallPalletDecoder } from './decoders/calls/identities/setSubs';
import { IdentityProvideJudgementCallPalletDecoder } from './decoders/calls/identities/provideJudgement';
import { IdentityAddSubCallPalletDecoder } from './decoders/calls/identities/addSub';
import { RenameIdentityCallPalletDecoder } from './decoders/calls/identities/renameIdentity';
import { SetIdentityCallPalletDecoder } from './decoders/calls/identities/setIdentity';
import { PayoutStakersCallPalletDecoder } from './decoders/calls/staking/payoutStakers';

createIndexer({
  config: {
    chain: ensureEnvVariable('CHAIN'),
    endpoint: ensureEnvVariable('CHAIN_RPC_ENDPOINT'),
  },
  pallets: {
    events: {
      'Balances.Transfer': setupPallet({ decoder: new TransferEventPalletDecoder() }),
      'Staking.Reward': setupPallet({ decoder: new StakingRewardEventPalletDecoder(), payoutStakersDecoder: new PayoutStakersCallPalletDecoder() }),
      // 'Staking.Rewarded': setupPallet({ decoder: new StakingRewardEventPalletDecoder(), payoutStakersDecoder: new PayoutStakersCallPalletDecoder() }),
    },
    calls: {
      // 'Identity.set_identity': new SetIdentityCallPalletDecoder(),
      // 'Identity.set_subs': new IdentitySetSubsCallPalletDecoder(),
      // 'Identity.provide_judgement': new IdentityProvideJudgementCallPalletDecoder(),
      // 'Identity.add_sub': new IdentityAddSubCallPalletDecoder(),
      // // 'Identity.clear_identity': new IdentityClearIdentityCallPalletDecoder(),
      // // 'Identity.kill_identity': new IdentityKillIdentityCallPalletDecoder(),
      // 'Identity.rename_sub': new RenameIdentityCallPalletDecoder(),
    },
  },
});
