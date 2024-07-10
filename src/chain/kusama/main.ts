import { ensureEnvVariable } from '@/utils';
import { Indexer, setupPallet } from '@/indexer';
import { AddSubCallPalletDecoder } from '@/chain/kusama/decoders/calls/identities/addSub';
import { SetSubsCallPalletDecoder } from '@/chain/kusama/decoders/calls/identities/setSubs';
import { TransferEventPalletDecoder } from '@/chain/kusama/decoders/events/balances/transfer';
import { StakingRewardEventPalletDecoder } from '@/chain/kusama/decoders/events/staking/reward';
import { SetIdentityCallPalletDecoder } from '@/chain/kusama/decoders/calls/identities/setIdentity';
import { PayoutStakersCallPalletDecoder } from '@/chain/kusama/decoders/calls/staking/payoutStakers';
import { RenameIdentityCallPalletDecoder } from '@/chain/kusama/decoders/calls/identities/renameIdentity';
import { ProvideJudgementCallPalletDecoder } from '@/chain/kusama/decoders/calls/identities/provideJudgement';
import { BondingDurationConstantGetter } from '@/chain/kusama/constants/bondingDuration';
import { RebondCallPalletDecoder } from '@/chain/kusama/decoders/calls/staking/rebond';
import { StakingBondedEventPalletDecoder } from '@/chain/kusama/decoders/events/staking/bonded';
import { StakingSlashEventPalletDecoder } from '@/chain/kusama/decoders/events/staking/slash';
import { StakingUnBondedEventPalletDecoder } from '@/chain/kusama/decoders/events/staking/unbonded';
import { StakingWithdrawnEventPalletDecoder } from '@/chain/kusama/decoders/events/staking/withdrawn';
import { CurrentEraStorageLoader } from '@/chain/kusama/storage/currentEra';
import { LedgerStorageLoader } from '@/chain/kusama/storage/ledger';
import { BondCallPalletDecoder } from '@/chain/kusama/decoders/calls/staking/bond';
import { UnbondCallPalletDecoder } from './decoders/calls/staking/unbond';
import { BondExtraCallPalletDecoder } from './decoders/calls/staking/bond_extra';

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
        storage: {
          currentEra: new CurrentEraStorageLoader(),
        },
      }),
      'Staking.Slash': setupPallet({ decoder: new StakingSlashEventPalletDecoder() }),
      'Staking.Slashed': setupPallet({ decoder: new StakingSlashEventPalletDecoder() }),
    },
    calls: {
      'Staking.bond': setupPallet({ decoder: new BondCallPalletDecoder() }),
      'Staking.bond_extra': setupPallet({ decoder: new BondExtraCallPalletDecoder() }),
      'Staking.rebond': setupPallet({ decoder: new RebondCallPalletDecoder(), storage: { ledger: new LedgerStorageLoader() } }),
      'Staking.unbond': setupPallet({
        decoder: new UnbondCallPalletDecoder(),
        storage: { ledger: new LedgerStorageLoader(), currentEra: new CurrentEraStorageLoader() },
        constants: {
          bondingDuration: new BondingDurationConstantGetter(),
        },
      }),
      'Identity.set_identity': setupPallet({ decoder: new SetIdentityCallPalletDecoder() }),
      'Identity.set_subs': setupPallet({ decoder: new SetSubsCallPalletDecoder() }),
      'Identity.provide_judgement': setupPallet({ decoder: new ProvideJudgementCallPalletDecoder() }),
      'Identity.add_sub': setupPallet({ decoder: new AddSubCallPalletDecoder() }),
      'Identity.rename_sub': setupPallet({ decoder: new RenameIdentityCallPalletDecoder() }),
    },
  },
});
