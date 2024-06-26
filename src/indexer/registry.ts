import { RewardEventPalletHandler } from '@/indexer/pallets/staking/events/reward';
import { AddSubCallPalletHandler } from '@/indexer/pallets/identity/calls/addSub';
import { SetSubsCallPalletHandler } from '@/indexer/pallets/identity/calls/setSubs';
import { TransferEventPalletHandler } from '@/indexer/pallets/balances/events/transfer';
import { RenameSubCallPalletHandler } from '@/indexer/pallets/identity/calls/renameSub';
import { SetIdentityCallPalletHandler } from '@/indexer/pallets/identity/calls/setIdentity';
import { KillIdentityCallPalletHandler } from '@/indexer/pallets/identity/calls/killIdentity';
import { ClearIdentityCallPalletHandler } from '@/indexer/pallets/identity/calls/clearIdentity';
import { ProvideJudgementCallPalletHandler } from '@/indexer/pallets/identity/calls/provideJudgement';
import { SubIdentityRemovedEventPalletHandler } from '@/indexer/pallets/identity/events/subIdentityRemoved';
import { SubIdentityRevokedEventPalletHandler } from '@/indexer/pallets/identity/events/subIdentityRevoked';

export const registry = {
  events: {
    'Balances.Transfer': TransferEventPalletHandler,
    'Staking.Reward': RewardEventPalletHandler,
    'Staking.Rewarded': RewardEventPalletHandler,
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
