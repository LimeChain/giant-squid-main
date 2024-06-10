import { SetIdentityCallPalletHandler } from './pallets/identity/calls/identity';
import { TransferEventPalletHandler } from './pallets/balances/events/transfer';
import { PalletCall, PalletCallDecoder, PalletEvent, PalletEventDecoder } from './types';

// TODO: Implement PalletTypes
export type PalletTypes = {
  events: {
    'Balances.Transfer': PalletEvent<{ from: string; to: string; amount: bigint }>;
    'Staking.Reward': PalletEvent<{ stash: string; amount: string }>;
    'Staking.Rewarded': PalletEvent<{ stash: string; amount: string }>;
  };
  calls: {
    'Identity.set_identity': PalletCall<{ name: string }>;
  };
};

// TODO: is this good to be placed here? I did it to have everything in 1 place
export interface ITransferEventPalletDecoder extends PalletEventDecoder<{ from: string; to: string; amount: bigint }> {}
export interface IIdentitySetIdentityCallPalletDecoder extends PalletCallDecoder<{ name: string }> {}

// TODO: fix any, implement PalletTypes
export const registry: Map<string, any> = new Map()
  .set('Balances.Transfer', TransferEventPalletHandler)
  .set('Identity.set_identity', SetIdentityCallPalletHandler);
// .set('Staking.Reward', TransferEventPalletHandler)
// .set('Staking.Rewarded', TransferEventPalletHandler)
// .set('Identity.SubIdentityRemoved', TransferEventPalletHandler)
// .set('Identity.SubIdentityRevoked', TransferEventPalletHandler)
// .set('Identity.set_identity', TransferEventPalletHandler)
// .set('Identity.provide_judgement', TransferEventPalletHandler)
// .set('Identity.set_subs', TransferEventPalletHandler)
// .set('Identity.rename_sub', TransferEventPalletHandler)
// .set('Identity.add_sub', TransferEventPalletHandler)
// .set('Identity.clear_identity', TransferEventPalletHandler)
// .set('Identity.kill_identity', TransferEventPalletHandler);
