import { createIndexer } from '../../main';
import { ensureEnvVariable } from '../../utils';
import { lookupArchive } from '@subsquid/archive-registry';
import {
  IdentityAddSubCallPalletDecoder,
  IdentityProvideJudgementCallPalletDecoder,
  IdentitySetSubsCallPalletDecoder,
  RenameIdentityCallPalletDecoder,
  SetIdentityCallPalletDecoder,
} from './decoders/calls/identities';
import { TransferEventPalletDecoder } from './decoders/events/balances';
import { StakingRewardEventPalletDecoder } from './decoders/events/staking';

createIndexer({
  config: {
    chain: ensureEnvVariable('CHAIN'),
    endpoint: ensureEnvVariable('CHAIN_RPC_ENDPOINT'),
    gateway: lookupArchive(ensureEnvVariable('CHAIN'), { release: 'ArrowSquid' }),
  },
  decoders: {
    events: {
      'Balances.Transfer': new TransferEventPalletDecoder(),
      'Staking.Reward': new StakingRewardEventPalletDecoder(),
      'Staking.Rewarded': new StakingRewardEventPalletDecoder(),
    },
    calls: {
      'Identity.set_identity': new SetIdentityCallPalletDecoder(),
      'Identity.set_subs': new IdentitySetSubsCallPalletDecoder(),
      'Identity.provide_judgement': new IdentityProvideJudgementCallPalletDecoder(),
      'Identity.add_sub': new IdentityAddSubCallPalletDecoder(),
      // 'Identity.clear_identity': new IdentityClearIdentityCallPalletDecoder(),
      // 'Identity.kill_identity': new IdentityKillIdentityCallPalletDecoder(),
      'Identity.rename_sub': new RenameIdentityCallPalletDecoder(),
    },
  },
});
