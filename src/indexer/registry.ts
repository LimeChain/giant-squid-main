import { PalletCall, PalletCallDecoder, PalletEvent, PalletEventDecoder } from './types';
import {
  IdentityAddSubCallPalletHandler,
  IdentityClearIdentityCallPalletHandler,
  IdentityProvideJudgementCallPalletHandler,
  IdentitySetSubsCallPalletHandler,
  SetIdentityCallPalletHandler,
  IdentityRenameSubCallPalletHandler,
  IdentityKillIdentityCallPalletHandler,
} from './pallets/identity/calls/identity';
import { TransferEventPalletHandler } from './pallets/balances/events/transfer';
import { StakingRewardPalletHandler } from './pallets/staking/events/staking';
import {
  IdentitySubIdentityRemovedEventPalletHandler,
  IdentitySubIdentityRevokedEventPalletHandler,
} from './pallets/identity/events/identity';

// TODO: Implement PalletTypes check for properties is correct
export type PalletTypes = {
  events: {
    'Balances.Transfer': PalletEvent<{ from: string; to: string; amount: bigint }>;
    'Staking.Reward': PalletEvent<{ stash: string; amount: bigint }>;
    'Staking.Rewarded': PalletEvent<{ stash: string; amount: bigint }>;
    'Identity.SubIdentityRemoved': PalletEvent<{ sub: string; main: string; deposit: bigint }>;
    'Identity.SubIdentityRevoked': PalletEvent<{ sub: string; main: string; deposit: bigint }>;
  };
  calls: {
    'Identity.add_sub': PalletCall<{ name: string }>;
    'Identity.set_identity': PalletCall<{ name: string }>;
    'Identity.rename_sub': PalletCall<{ name: string }>;
    'Identity.set_subs': PalletCall<{ subs: string[] }>;
    'Identity.provide_judgement': PalletCall<{ target: string; judgement: string }>;
    'Identity.clear_identity': PalletCall<{}>;
    'Identity.kill_identity': PalletCall<{}>;
  };
};

// TODO: is this good to be placed here? I did it to have everything in 1 place
// check if each of these is needed and is correct
export interface ITransferEventPalletDecoder extends PalletEventDecoder<{ from: string; to: string; amount: bigint }> {}
export interface IStakingRewardEventPalletDecoder extends PalletEventDecoder<{ stash: string; amount: bigint }> {}
export interface IIdentitySubIdentityRemovedEventPalletDecoder extends PalletEventDecoder<{ sub: string; main: string; deposit: bigint }> {}
export interface IIdentitySubIdentityRevokedEventPalletDecoder extends PalletEventDecoder<{ sub: string; main: string; deposit: bigint }> {}

export interface IIdentitySetIdentityCallPalletDecoder extends PalletCallDecoder<{ name: string }> {}
export interface IIdentityRenameSubCallPalletDecoder extends PalletCallDecoder<{ name: string }> {}
export interface IIdentitySetSubsCallPalletDecoder extends PalletCallDecoder<{ subs: string[] }> {}
export interface IIdentityProvideJudgementCallPalletDecoder extends PalletCallDecoder<{ target: string; judgement: string }> {}
export interface IIdentityAddSubCallPalletDecoder extends PalletCallDecoder<{ name: string }> {}
export interface IIdentityClearIdentityCallPalletDecoder extends PalletCallDecoder<{}> {}
export interface IIdentityKillIdentityCallPalletDecoder extends PalletCallDecoder<{}> {}

export const registry: Map<string, any> = new Map()
  .set('Balances.Transfer', TransferEventPalletHandler)
  .set('Identity.set_identity', SetIdentityCallPalletHandler)
  .set('Staking.Reward', StakingRewardPalletHandler)
  .set('Staking.Rewarded', StakingRewardPalletHandler)
  .set('Identity.SubIdentityRemoved', IdentitySubIdentityRemovedEventPalletHandler)
  .set('Identity.SubIdentityRevoked', IdentitySubIdentityRevokedEventPalletHandler)
  .set('Identity.provide_judgement', IdentityProvideJudgementCallPalletHandler)
  .set('Identity.set_subs', IdentitySetSubsCallPalletHandler)
  .set('Identity.rename_sub', IdentityRenameSubCallPalletHandler)
  .set('Identity.add_sub', IdentityAddSubCallPalletHandler)
  .set('Identity.clear_identity', IdentityClearIdentityCallPalletHandler)
  .set('Identity.kill_identity', IdentityKillIdentityCallPalletHandler);
