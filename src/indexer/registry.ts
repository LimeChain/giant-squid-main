import { RewardEventPalletHandler } from './pallets/staking/events/reward';
import { AddSubCallPalletHandler } from './pallets/identity/calls/addSub';
import { SetSubsCallPalletHandler } from './pallets/identity/calls/setSubs';
import { TransferEventPalletHandler } from './pallets/balances/events/transfer';
import { RenameSubCallPalletHandler } from './pallets/identity/calls/renameSub';
import { SetIdentityCallPalletHandler } from './pallets/identity/calls/setIdentity';
import { KillIdentityCallPalletHandler } from './pallets/identity/calls/killIdentity';
import { ClearIdentityCallPalletHandler } from './pallets/identity/calls/clearIdentity';
import { ProvideJudgementCallPalletHandler } from './pallets/identity/calls/provideJudgement';
import { SubIdentityRemovedEventPalletHandler } from './pallets/identity/events/subIdentityRemoved';
import { SubIdentityRevokedEventPalletHandler } from './pallets/identity/events/subIdentityRevoked';
import { SlashEventPalletHandler } from './pallets/staking/events/slash';
import { BondedEventPalletHandler } from './pallets/staking/events/bonded';
import { UnBondedEventPalletHandler } from './pallets/staking/events/unbonded';

export const registry = {
  events: {
    'Balances.Transfer': TransferEventPalletHandler,
    'Staking.Reward': RewardEventPalletHandler,
    'Staking.Rewarded': RewardEventPalletHandler,
    'Staking.Bonded': BondedEventPalletHandler,
    'Staking.Unbonded': UnBondedEventPalletHandler,
    'Staking.Slash': SlashEventPalletHandler,
    'Staking.Slashed': SlashEventPalletHandler,
    'Identity.SubIdentityRemoved': SubIdentityRemovedEventPalletHandler,
    'Identity.SubIdentityRevoked': SubIdentityRevokedEventPalletHandler,
  },
  calls: {
    'Identity.set_identity': SetIdentityCallPalletHandler,
    'Identity.set_subs': SetSubsCallPalletHandler,
    'Identity.provide_judgement': ProvideJudgementCallPalletHandler,
    'Identity.add_sub': AddSubCallPalletHandler,
    'Identity.clear_identity': ClearIdentityCallPalletHandler,
    'Identity.kill_identity': KillIdentityCallPalletHandler,
    'Identity.rename_sub': RenameSubCallPalletHandler,
  },
};

// Type to infer the constructor parameters
type ConstructorParametersOf<T> = T extends new (...args: infer P) => any ? P : never;

export type RegistryEvent = typeof registry.events;
export type RegistryCall = typeof registry.calls;

export type PalletSetups = {
  events?: {
    [K in keyof RegistryEvent]?: ConstructorParametersOf<RegistryEvent[K]>[0];
  };
  calls?: {
    [K in keyof RegistryCall]?: ConstructorParametersOf<RegistryCall[K]>[0];
  };
};
