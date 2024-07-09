import { ensureEnvVariable } from '@/utils';
import { Indexer, setupPallet } from '@/indexer';
import { AddSubCallPalletDecoder } from '@/chain/polkadot/decoders/calls/identities/addSub';
import { SetSubsCallPalletDecoder } from '@/chain/polkadot/decoders/calls/identities/setSubs';
import { TransferEventPalletDecoder } from '@/chain/polkadot/decoders/events/balances/transfer';
import { StakingRewardEventPalletDecoder } from '@/chain/polkadot/decoders/events/staking/reward';
import { SetIdentityCallPalletDecoder } from '@/chain/polkadot/decoders/calls/identities/setIdentity';
import { PayoutStakersCallPalletDecoder } from '@/chain/polkadot/decoders/calls/staking/payoutStakers';
import { RenameIdentityCallPalletDecoder } from '@/chain/polkadot/decoders/calls/identities/renameIdentity';
import { ProvideJudgementCallPalletDecoder } from '@/chain/polkadot/decoders/calls/identities/provideJudgement';
import { StakingSlashEventPalletDecoder } from '@/chain/polkadot/decoders/events/staking/slash';
import { StakingBondedEventPalletDecoder } from '@/chain/polkadot/decoders/events/staking/bonded';
import { StakingUnBondedEventPalletDecoder } from '@/chain/polkadot/decoders/events/staking/unbonded';
import { BondingDurationConstantGetter } from '@/chain/polkadot/constants/bondingDuration';
import { CurrentEraStorageLoader } from '@/chain/polkadot/storage/currentEra';
import { StakingWithdrawnEventPalletDecoder } from '@/chain/polkadot/decoders/events/staking/withdrawn';
import { RebondCallPalletDecoder } from '@/chain/polkadot/decoders/calls/staking/rebond';
import { LedgerStorageLoader } from '@/chain/polkadot/storage/ledger';

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
      'Staking.Bonded': setupPallet({ decoder: new StakingBondedEventPalletDecoder(), skipCalls: false }),
      'Staking.Unbonded': setupPallet({
        decoder: new StakingUnBondedEventPalletDecoder(),
        constants: {
          bondingDuration: new BondingDurationConstantGetter(),
        },
        storage: {
          currentEra: new CurrentEraStorageLoader(),
        },
        skipCalls: false,
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
      'Staking.rebond': setupPallet({ decoder: new RebondCallPalletDecoder(), storage: { ledger: new LedgerStorageLoader() } }),
      'Identity.set_identity': setupPallet({ decoder: new SetIdentityCallPalletDecoder() }),
      'Identity.set_subs': setupPallet({ decoder: new SetSubsCallPalletDecoder() }),
      'Identity.provide_judgement': setupPallet({ decoder: new ProvideJudgementCallPalletDecoder() }),
      'Identity.add_sub': setupPallet({ decoder: new AddSubCallPalletDecoder() }),
      'Identity.rename_sub': setupPallet({ decoder: new RenameIdentityCallPalletDecoder() }),
    },
  },
});
