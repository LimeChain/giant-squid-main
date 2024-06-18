export { ITransferEventPalletDecoder } from './pallets/balances/events/transfer'
export { IPayoutStakersCallPalletDecoder, IRewardEventPalletDecoder } from './pallets/staking/events/reward';
export { Event, Call } from './processor'


export { createIndexer, setupPallet } from './main';




