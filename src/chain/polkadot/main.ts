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
import { BondCallPalletDecoder } from '@/chain/polkadot/decoders/calls/staking/bond';
import { SetPayeeCallPalletDecoder } from '@/chain/polkadot/decoders/calls/staking/setPayee';
import { BondExtraCallPalletDecoder } from '@/chain/polkadot/decoders/calls/staking/bond_extra';
import { UnbondCallPalletDecoder } from '@/chain/polkadot/decoders/calls/staking/unbond';
import { SetControllerCallPalletDecoder } from '@/chain/polkadot/decoders/calls/staking/setController';
import { CreateCallPalletDecoder } from '@/chain/polkadot/decoders/calls/crowdloan/create';
import { DissolvedEventPalletDecoder } from '@/chain/polkadot/decoders/events/crowdloan/dissolved';
import { ReservedEventPalletDecoder } from '@/chain/polkadot/decoders/events/registrar/reserved';
import { RegisteredEventPalletDecoder } from '@/chain/polkadot/decoders/events/registrar/registered';
import { DeregisteredEventPalletDecoder } from '@/chain/polkadot/decoders/events/registrar/deregistered';
import { ContributedEventPalletDecoder } from '@/chain/polkadot/decoders/events/crowdloan/contributed';
import { PartiallyRefundedEventPalletDecoder } from '@/chain/polkadot/decoders/events/crowdloan/partiallyRefunded';
import { AllRefundedEventPalletDecoder } from '@/chain/polkadot/decoders/events/crowdloan/allRefunded';
import { WithdrewEventPalletDecoder } from '@/chain/polkadot/decoders/events/crowdloan/withdrew';
import { RemoveKeysLimitConstantGetter } from './constants/removeKeysLimit';
import { DelegateCallPalletDecoder } from '@/chain/polkadot/decoders/calls/conviction-voting/delegate';
import { UnlockCallPalletDecoder } from '@/chain/polkadot/decoders/calls/conviction-voting/unlock';
import { UndelegateCallPalletDecoder } from '@/chain/polkadot/decoders/calls/conviction-voting/undelegate';
import { VoteCallPalletDecoder } from '@/chain/polkadot/decoders/calls/conviction-voting/vote';
import { RemoveVoteCallPalletDecoder } from '@/chain/polkadot/decoders/calls/conviction-voting/removeVote';
import { DelegatedEventPalletDecoder } from '@/chain/polkadot/decoders/events/conviction-voting/delegated';
import { VotedEventPalletDecoder } from '@/chain/polkadot/decoders/events/conviction-voting/voted';
import { VoteRemovedEventPalletDecoder } from '@/chain/polkadot/decoders/events/conviction-voting/voteRemoved';
import { UndelegatedEventPalletDecoder } from '@/chain/polkadot/decoders/events/conviction-voting/undelegate';

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
      'Crowdloan.PartiallyRefunded': setupPallet({
        decoder: new PartiallyRefundedEventPalletDecoder(),
        constants: { removeKeysLimit: new RemoveKeysLimitConstantGetter() },
      }),
      'Crowdloan.AllRefunded': setupPallet({
        decoder: new AllRefundedEventPalletDecoder(),
        constants: { removeKeysLimit: new RemoveKeysLimitConstantGetter() },
      }),
      'Crowdloan.Withdrew': setupPallet({ decoder: new WithdrewEventPalletDecoder() }),
      'Crowdloan.Dissolved': setupPallet({ decoder: new DissolvedEventPalletDecoder() }),
      'Crowdloan.Contributed': setupPallet({ decoder: new ContributedEventPalletDecoder() }),
      'Registrar.Reserved': setupPallet({ decoder: new ReservedEventPalletDecoder() }),
      'Registrar.Registered': setupPallet({ decoder: new RegisteredEventPalletDecoder() }),
      'Registrar.Deregistered': setupPallet({ decoder: new DeregisteredEventPalletDecoder() }),
      'ConvictionVoting.Delegated': setupPallet({ delegateDecoder: new DelegateCallPalletDecoder(), decoder: new DelegatedEventPalletDecoder() }),
      'ConvictionVoting.Undelegated': setupPallet({ undelegateDecoder: new UndelegateCallPalletDecoder(), decoder: new UndelegatedEventPalletDecoder() }),
      'ConvictionVoting.Voted': setupPallet({ voteDecoder: new VoteCallPalletDecoder(), decoder: new VotedEventPalletDecoder() }),
      'ConvictionVoting.VoteRemoved': setupPallet({ removeVoteDecoder: new RemoveVoteCallPalletDecoder(), decoder: new VoteRemovedEventPalletDecoder() }),
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
      'Staking.set_payee': setupPallet({ decoder: new SetPayeeCallPalletDecoder(), storage: { ledger: new LedgerStorageLoader() } }),
      'Staking.set_controller': setupPallet({ decoder: new SetControllerCallPalletDecoder() }),
      'Identity.set_identity': setupPallet({ decoder: new SetIdentityCallPalletDecoder() }),
      'Identity.set_subs': setupPallet({ decoder: new SetSubsCallPalletDecoder() }),
      'Identity.provide_judgement': setupPallet({ decoder: new ProvideJudgementCallPalletDecoder() }),
      'Identity.add_sub': setupPallet({ decoder: new AddSubCallPalletDecoder() }),
      'Identity.rename_sub': setupPallet({ decoder: new RenameIdentityCallPalletDecoder() }),
      'Crowdloan.create': setupPallet({ decoder: new CreateCallPalletDecoder() }),
      'ConvictionVoting.unlock': setupPallet({ decoder: new UnlockCallPalletDecoder() }),
    },
  },
});
