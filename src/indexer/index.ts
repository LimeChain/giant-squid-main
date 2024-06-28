export { Event, Call, Block, BlockHeader, ProcessorContext } from './processor';
export { ISlashEventPalletDecoder } from './pallets/staking/events/slash';
export { IAddSubCallPalletDecoder } from './pallets/identity/calls/addSub';
export { IBondedEventPalletDecoder } from './pallets/staking/events/bonded';
export { ISetSubsCallPalletDecoder } from './pallets/identity/calls/setSubs';
export { IUnBondedEventPalletDecoder } from './pallets/staking/events/unbonded';
export { ITransferEventPalletDecoder } from './pallets/balances/events/transfer';
export { IRenameSubCallPalletDecoder } from './pallets/identity/calls/renameSub';
export { IWithdrawnEventPalletDecoder } from './pallets/staking/events/withdrawn';
export { ISetIdentityCallPalletDecoder } from './pallets/identity/calls/setIdentity';
export { IKillIdentityCallPalletDecoder } from './pallets/identity/calls/killIdentity';
export { IClearIdentityCallPalletDecoder } from './pallets/identity/calls/clearIdentity';
export { IProvideJudgementCallPalletDecoder } from './pallets/identity/calls/provideJudgement';
export { ISubIdentityRemovedEventPalletDecoder } from './pallets/identity/events/subIdentityRemoved';
export { ISubIdentityRevokedEventPalletDecoder } from './pallets/identity/events/subIdentityRevoked';
export { IPayoutStakersCallPalletDecoder, IRewardEventPalletDecoder } from './pallets/staking/events/reward';

export { IBondingDurationConstantGetter } from './pallets/staking/constants';
export { ICurrentEraStorageLoader } from './pallets/staking/storage';

export { Indexer, setupPallet } from './main';
