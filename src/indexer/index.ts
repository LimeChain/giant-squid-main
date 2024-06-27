export { Event, Call } from '@/indexer/processor';
export { IAddSubCallPalletDecoder } from '@/indexer/pallets/identity/calls/addSub';
export { ISetSubsCallPalletDecoder } from '@/indexer/pallets/identity/calls/setSubs';
export { ITransferEventPalletDecoder } from '@/indexer/pallets/balances/events/transfer';
export { IRenameSubCallPalletDecoder } from '@/indexer/pallets/identity/calls/renameSub';
export { ISetIdentityCallPalletDecoder } from '@/indexer/pallets/identity/calls/setIdentity';
export { IKillIdentityCallPalletDecoder } from '@/indexer/pallets/identity/calls/killIdentity';
export { IClearIdentityCallPalletDecoder } from '@/indexer/pallets/identity/calls/clearIdentity';
export { IProvideJudgementCallPalletDecoder } from '@/indexer/pallets/identity/calls/provideJudgement';
export { ISubIdentityRemovedEventPalletDecoder } from '@/indexer/pallets/identity/events/subIdentityRemoved';
export { ISubIdentityRevokedEventPalletDecoder } from '@/indexer/pallets/identity/events/subIdentityRevoked';
export { IPayoutStakersCallPalletDecoder, IRewardEventPalletDecoder } from '@/indexer/pallets/staking/events/reward';

export { Indexer, setupPallet } from '@/indexer/main';
