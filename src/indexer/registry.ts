import { IdentityInfo, PalletCall, PalletCallDecoder, PalletEvent, PalletEventDecoder, WrappedData } from './types';
import { SetIdentityCallPalletHandler } from './pallets/identity/calls/setIdentity';
import { TransferEventPalletHandler } from './pallets/balances/events/transfer';
import { StakingRewardPalletHandler } from './pallets/staking/events/reward';
import { IdentitySubIdentityRemovedEventPalletHandler } from './pallets/identity/events/subIdentityRemoved';
import { IdentityRenameSubCallPalletHandler } from './pallets/identity/calls/renameSub';
import { IdentitySubIdentityRevokedEventPalletHandler } from './pallets/identity/events/subIdentityRevoked';
import { IdentitySetSubsCallPalletHandler } from './pallets/identity/calls/setSubs';
import { IdentityProvideJudgementCallPalletHandler } from './pallets/identity/calls/provideJudgement';
import { IdentityAddSubCallPalletHandler } from './pallets/identity/calls/addSub';
import { IdentityClearIdentityCallPalletHandler } from './pallets/identity/calls/clearIdentity';
import { IdentityKillIdentityCallPalletHandler } from './pallets/identity/calls/killIdentity';

// TODO: Check if each are correct
export type PalletTypes = {
  events: {
    'Balances.Transfer': PalletEvent<{ from: string; to: string; amount: bigint }>;
    'Staking.Reward': PalletEvent<{ stash: string; amount: bigint } | undefined>;
    'Staking.Rewarded': PalletEvent<{ stash: string; amount: bigint } | undefined>;
    'Identity.SubIdentityRemoved': PalletEvent<{ sub: string; main: string; deposit: bigint }>;
    'Identity.SubIdentityRevoked': PalletEvent<{ sub: string; main: string; deposit: bigint }>;
  };
  calls: {
    'Identity.set_identity': PalletCall<IdentityInfo>;
    'Identity.set_subs': PalletCall<{ subs: [string, WrappedData][] }>;
    'Identity.provide_judgement': PalletCall<{ regIndex: number; target: string; judgement: WrappedData }>;
    'Identity.add_sub': PalletCall<{ name: string; sub: string; data: WrappedData }>;
    'Identity.clear_identity': PalletCall<{ sub: string; data: WrappedData }>;
    'Identity.kill_identity': PalletCall<{ target: string | WrappedData }>;
    'Identity.rename_sub': PalletCall<{ sub: string; data: WrappedData }>;
  };
};

// TODO: Check if each are correct
export interface ITransferEventPalletDecoder extends PalletEventDecoder<{ from: string; to: string; amount: bigint }> {}
export interface IStakingRewardEventPalletDecoder extends PalletEventDecoder<{ stash: string; amount: bigint } | undefined> {}
export interface IStakingPayoutStakersCallPalletDecoder extends PalletCallDecoder<{ validatorStash: string; era: number }> {}
export interface IIdentitySubIdentityRemovedEventPalletDecoder extends PalletEventDecoder<{ sub: string; main: string; deposit: bigint }> {}
export interface IIdentitySubIdentityRevokedEventPalletDecoder extends PalletEventDecoder<{ sub: string; main: string; deposit: bigint }> {}
// TODO: check this return type
export interface IIdentitySetIdentityCallPalletDecoder extends PalletCallDecoder<IdentityInfo> {}
// TODO: check this return type
export interface IIdentitySetSubsCallPalletDecoder extends PalletCallDecoder<{ subs: [string, WrappedData][] }> {}
// TODO: check this return type
export interface IIdentityProvideJudgementCallPalletDecoder
  extends PalletCallDecoder<{ regIndex: number; target: string; judgement: WrappedData }> {}
// TODO: check this return type
export interface IIdentityAddSubCallPalletDecoder extends PalletCallDecoder<{ name: string; sub: string; data: WrappedData }> {}
export interface IIdentityClearIdentityCallPalletDecoder extends PalletCallDecoder<{ sub: string; data: WrappedData }> {}
export interface IIdentityKillIdentityCallPalletDecoder extends PalletCallDecoder<{ target: string | WrappedData }> {}
export interface IIdentityRenameSubCallPalletDecoder extends PalletCallDecoder<{ sub: string; data: WrappedData }> {}

// TODO: fix any
export const registry: Map<string, any> = new Map()
  .set('Balances.Transfer', TransferEventPalletHandler)
  .set('Staking.Reward', StakingRewardPalletHandler)
  .set('Staking.Rewarded', StakingRewardPalletHandler)
  .set('Identity.SubIdentityRemoved', IdentitySubIdentityRemovedEventPalletHandler)
  .set('Identity.SubIdentityRevoked', IdentitySubIdentityRevokedEventPalletHandler)
  .set('Identity.set_identity', SetIdentityCallPalletHandler)
  .set('Identity.set_subs', IdentitySetSubsCallPalletHandler)
  .set('Identity.provide_judgement', IdentityProvideJudgementCallPalletHandler)
  .set('Identity.add_sub', IdentityAddSubCallPalletHandler)
  .set('Identity.clear_identity', IdentityClearIdentityCallPalletHandler)
  .set('Identity.kill_identity', IdentityKillIdentityCallPalletHandler)
  .set('Identity.rename_sub', IdentityRenameSubCallPalletHandler);
