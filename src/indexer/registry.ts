import { IdentityInfo, ICallPalletDecoder, IEventPalletDecoder, WrappedData } from './types';
import { SetIdentityCallPalletHandler } from './pallets/identity/calls/setIdentity';
import { TransferEventPalletHandler } from './pallets/balances/events/transfer';
import { RewardEventPalletHandler } from './pallets/staking/events/reward';
import { IdentitySubIdentityRemovedEventPalletHandler } from './pallets/identity/events/subIdentityRemoved';
import { IdentityRenameSubCallPalletHandler } from './pallets/identity/calls/renameSub';
import { IdentitySubIdentityRevokedEventPalletHandler } from './pallets/identity/events/subIdentityRevoked';
import { IdentitySetSubsCallPalletHandler } from './pallets/identity/calls/setSubs';
import { IdentityProvideJudgementCallPalletHandler } from './pallets/identity/calls/provideJudgement';
import { IdentityAddSubCallPalletHandler } from './pallets/identity/calls/addSub';
import { IdentityClearIdentityCallPalletHandler } from './pallets/identity/calls/clearIdentity';
import { IdentityKillIdentityCallPalletHandler } from './pallets/identity/calls/killIdentity';

// TODO: Check if each are correct
// export interface ITransferEventPalletDecoder extends IEventPalletDecoder<{ from: string; to: string; amount: bigint }> {}
// export interface IStakingRewardEventPalletDecoder extends IEventPalletDecoder<{ stash: string; amount: bigint } | undefined> { }
// export interface IStakingPayoutStakersCallPalletDecoder extends ICallPalletDecoder<{ validatorStash: string; era: number }> { }
export interface IIdentitySubIdentityRemovedEventPalletDecoder extends IEventPalletDecoder<{ sub: string; main: string; deposit: bigint }> { }
export interface IIdentitySubIdentityRevokedEventPalletDecoder extends IEventPalletDecoder<{ sub: string; main: string; deposit: bigint }> { }
// TODO: check this return type
// export interface IIdentitySetIdentityCallPalletDecoder extends ICallPalletDecoder<IdentityInfo> { }
// TODO: check this return type
export interface IIdentitySetSubsCallPalletDecoder extends ICallPalletDecoder<{ subs: [string, WrappedData][] }> { }
// TODO: check this return type
export interface IIdentityProvideJudgementCallPalletDecoder
  extends ICallPalletDecoder<{ regIndex: number; target: string; judgement: WrappedData }> { }
// TODO: check this return type
export interface IIdentityAddSubCallPalletDecoder extends ICallPalletDecoder<{ name: string; sub: string; data: WrappedData }> { }
export interface IIdentityClearIdentityCallPalletDecoder extends ICallPalletDecoder<{ sub: string; data: WrappedData }> { }
export interface IIdentityKillIdentityCallPalletDecoder extends ICallPalletDecoder<{ target: string | WrappedData }> { }
export interface IIdentityRenameSubCallPalletDecoder extends ICallPalletDecoder<{ sub: string; data: WrappedData }> { }


export const registry = {
  events: {
    'Balances.Transfer': TransferEventPalletHandler,
    'Staking.Reward': RewardEventPalletHandler,
    // 'Staking.Rewarded': StakingRewardPalletHandler,
    // 'Identity.SubIdentityRemoved': IdentitySubIdentityRemovedEventPalletHandler,
    // 'Identity.SubIdentityRevoked': IdentitySubIdentityRevokedEventPalletHandler
  },
  calls: {
    'Identity.set_identity': SetIdentityCallPalletHandler,
    // 'Identity.set_subs': IdentitySetSubsCallPalletHandler,
    // 'Identity.provide_judgement': IdentityProvideJudgementCallPalletHandler,
    // 'Identity.add_sub': IdentityAddSubCallPalletHandler,
    // 'Identity.clear_identity': IdentityClearIdentityCallPalletHandler,
    // 'Identity.kill_identity': IdentityKillIdentityCallPalletHandler,
    // 'Identity.rename_sub': IdentityRenameSubCallPalletHandler
  }
}

// Type to infer the constructor parameters
type ConstructorParametersOf<T> = T extends new (...args: infer P) => any ? P : never;

export type RegistryEvent = typeof registry.events;
export type RegistryCall = typeof registry.calls;

export type PalletSetups = {
  events?: {
    [K in keyof RegistryEvent]?: ConstructorParametersOf<RegistryEvent[K]>[0];
  },
  calls?: {
    [K in keyof RegistryCall]?: ConstructorParametersOf<RegistryCall[K]>[0];
  }
}