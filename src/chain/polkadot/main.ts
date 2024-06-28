import { ensureEnvVariable } from '../../utils';
import { Indexer, setupPallet } from '../../indexer';
import { AddSubCallPalletDecoder } from './decoders/calls/identities/addSub';
import { SetSubsCallPalletDecoder } from './decoders/calls/identities/setSubs';
import { TransferEventPalletDecoder } from './decoders/events/balances/transfer';
import { StakingRewardEventPalletDecoder } from './decoders/events/staking/reward';
import { SetIdentityCallPalletDecoder } from './decoders/calls/identities/setIdentity';
import { PayoutStakersCallPalletDecoder } from './decoders/calls/staking/payoutStakers';
import { RenameIdentityCallPalletDecoder } from './decoders/calls/identities/renameIdentity';
import { ProvideJudgementCallPalletDecoder } from './decoders/calls/identities/provideJudgement';
import { StakingSlashEventPalletDecoder } from './decoders/events/staking/stash';
import { StakingBondedEventPalletDecoder } from './decoders/events/staking/bonded';
import { StakingUnBondedEventPalletDecoder } from './decoders/events/staking/unbonded';
import { BondingDurationConstantGetter } from './constants/bondingDuration';
import { CurrentEraStorageLoader } from './storage/currentEra';
import { LedgerStorageLoader } from './storage/ledger';
import { StakingWithdrawnEventPalletDecoder } from './decoders/events/staking/withdrawn';

export const indexer = new Indexer({
  config: {
    chain: ensureEnvVariable('CHAIN'),
    endpoint: ensureEnvVariable('CHAIN_RPC_ENDPOINT'),
  },
  pallets: {
    events: {
      'Balances.Transfer': setupPallet({ decoder: new TransferEventPalletDecoder() }),
      'Staking.Reward': setupPallet({ decoder: new StakingRewardEventPalletDecoder(), payoutStakersDecoder: new PayoutStakersCallPalletDecoder() }),
      'Staking.Rewarded': setupPallet({ decoder: new StakingRewardEventPalletDecoder(), payoutStakersDecoder: new PayoutStakersCallPalletDecoder() }),
      'Staking.Bonded': setupPallet({ decoder: new StakingBondedEventPalletDecoder() }),
      'Staking.Unbonded': setupPallet({
        decoder: new StakingUnBondedEventPalletDecoder(),
        constants: {
          bondingDuration: new BondingDurationConstantGetter(),
        },
        storage: {
          currentEra: new CurrentEraStorageLoader(),
        },
      }),
      'Staking.Withdrawn': setupPallet({
        decoder: new StakingWithdrawnEventPalletDecoder(),
        constants: {
          bondingDuration: new BondingDurationConstantGetter(),
        },
        storage: {
          currentEra: new CurrentEraStorageLoader(),
          ledger: new LedgerStorageLoader(),
        },
      }),
      'Staking.Slash': setupPallet({ decoder: new StakingSlashEventPalletDecoder() }),
      'Staking.Slashed': setupPallet({ decoder: new StakingSlashEventPalletDecoder() }),
    },
    calls: {
      'Identity.set_identity': setupPallet({ decoder: new SetIdentityCallPalletDecoder() }),
      'Identity.set_subs': setupPallet({ decoder: new SetSubsCallPalletDecoder() }),
      'Identity.provide_judgement': setupPallet({ decoder: new ProvideJudgementCallPalletDecoder() }),
      'Identity.add_sub': setupPallet({ decoder: new AddSubCallPalletDecoder() }),
      'Identity.rename_sub': setupPallet({ decoder: new RenameIdentityCallPalletDecoder() }),
    },
  },
});
