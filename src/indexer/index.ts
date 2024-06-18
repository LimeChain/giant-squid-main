export { Event, Call } from './processor';
export { IAddSubCallPalletDecoder } from './pallets/identity/calls/addSub';
export { ISetSubsCallPalletDecoder } from './pallets/identity/calls/setSubs';
export { ITransferEventPalletDecoder } from './pallets/balances/events/transfer';
export { IRenameSubCallPalletDecoder } from './pallets/identity/calls/renameSub';
export { ISetIdentityCallPalletDecoder } from './pallets/identity/calls/setIdentity';
export { IKillIdentityCallPalletDecoder } from './pallets/identity/calls/killIdentity';
export { IClearIdentityCallPalletDecoder } from './pallets/identity/calls/clearIdentity';
export { IProvideJudgementCallPalletDecoder } from './pallets/identity/calls/provideJudgement';
export { ISubIdentityRemovedEventPalletDecoder } from './pallets/identity/events/subIdentityRemoved';
export { ISubIdentityRevokedEventPalletDecoder } from './pallets/identity/events/subIdentityRevoked';
export { IPayoutStakersCallPalletDecoder, IRewardEventPalletDecoder } from './pallets/staking/events/reward';

export { createIndexer, setupPallet } from './main';
