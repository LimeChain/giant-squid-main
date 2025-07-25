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
import { UnbondCallPalletDecoder } from '@/chain/kusama/decoders/calls/staking/unbond';
import { BondExtraCallPalletDecoder } from '@/chain/kusama/decoders/calls/staking/bond_extra';
import { SetPayeeCallPalletDecoder } from '@/chain/kusama/decoders/calls/staking/setPayee';
import { SetControllerCallPalletDecoder } from '@/chain/kusama/decoders/calls/staking/setController';
import { CreateCallPalletDecoder } from '@/chain/kusama/decoders/calls/crowdloan/create';
import { DissolvedEventPalletDecoder } from '@/chain/kusama/decoders/events/crowdloan/dissolved';
import { ReservedEventPalletDecoder } from '@/chain/kusama/decoders/events/registrar/reserved';
import { RegisteredEventPalletDecoder } from '@/chain/kusama/decoders/events/registrar/registered';
import { DeregisteredEventPalletDecoder } from '@/chain/kusama/decoders/events/registrar/deregistered';
import { ContributedEventPalletDecoder } from '@/chain/kusama/decoders/events/crowdloan/contributed';
import { PartiallyRefundedEventPalletDecoder } from '@/chain/kusama/decoders/events/crowdloan/partiallyRefunded';
import { RemoveKeysLimitConstantGetter } from '@/chain/kusama/constants/removeKeysLimit';
import { AllRefundedEventPalletDecoder } from '@/chain/kusama/decoders/events/crowdloan/allRefunded';
import { WithdrewEventPalletDecoder } from '@/chain/kusama/decoders/events/crowdloan/withdrew';
import { DelegateCallPalletDecoder } from '@/chain/kusama/decoders/calls/conviction-voting/delegate';
import { UndelegateCallPalletDecoder } from '@/chain/kusama/decoders/calls/conviction-voting/undelegate';
import { VoteCallPalletDecoder } from '@/chain/kusama/decoders/calls/conviction-voting/vote';
import { RemoveVoteCallPalletDecoder } from '@/chain/kusama/decoders/calls/conviction-voting/removeVote';
import { UnlockCallPalletDecoder } from '@/chain/kusama/decoders/calls/conviction-voting/unlock';
import { NominationPoolsBondedEventPalletDecoder } from '@/chain/kusama/decoders/events/nomination-pools/bonded';
import { NominationPoolsDestroyedEventPalletDecoder } from '@/chain/kusama/decoders/events/nomination-pools/destroyed';
import { NominationPoolsPaidOutEventPalletDecoder } from '@/chain/kusama/decoders/events/nomination-pools/paidOut';
import { NominationPoolsStateChangedEventPalletDecoder } from '@/chain/kusama/decoders/events/nomination-pools/stateChanged';
import { NominationPoolsUnbondedEventPalletDecoder } from '@/chain/kusama/decoders/events/nomination-pools/unbonded';
import { NominationPoolsWithdrawnEventPalletDecoder } from '@/chain/kusama/decoders/events/nomination-pools/withdrawn';
import { CreatePoolCallPalletDecoder } from '@/chain/kusama/decoders/calls/nomination-pools/create';
import { NominateCallPalletDecoder } from '@/chain/kusama/decoders/calls/nomination-pools/nominate';
import { SetMetadataCallPalletDecoder } from '@/chain/kusama/decoders/calls/nomination-pools/setMetadata';
import { UpdateRolesCallPalletDecoder } from '@/chain/kusama/decoders/calls/nomination-pools/updateRoles';
import { XcmSentEventPalletDecoder } from '@/chain/kusama/decoders/events/xcm/sent';

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
      'Crowdloan.Dissolved': setupPallet({ decoder: new DissolvedEventPalletDecoder() }),
      'Crowdloan.Contributed': setupPallet({ decoder: new ContributedEventPalletDecoder() }),
      'Crowdloan.PartiallyRefunded': setupPallet({
        decoder: new PartiallyRefundedEventPalletDecoder(),
        constants: { removeKeysLimit: new RemoveKeysLimitConstantGetter() },
      }),
      'Crowdloan.AllRefunded': setupPallet({
        decoder: new AllRefundedEventPalletDecoder(),
        constants: { removeKeysLimit: new RemoveKeysLimitConstantGetter() },
      }),
      'Crowdloan.Withdrew': setupPallet({ decoder: new WithdrewEventPalletDecoder() }),
      'Registrar.Reserved': setupPallet({ decoder: new ReservedEventPalletDecoder() }),
      'Registrar.Registered': setupPallet({ decoder: new RegisteredEventPalletDecoder() }),
      'Registrar.Deregistered': setupPallet({ decoder: new DeregisteredEventPalletDecoder() }),
      'NominationPools.Bonded': setupPallet({ decoder: new NominationPoolsBondedEventPalletDecoder() }),
      'NominationPools.Destroyed': setupPallet({ decoder: new NominationPoolsDestroyedEventPalletDecoder() }),
      'NominationPools.Unbonded': setupPallet({ decoder: new NominationPoolsUnbondedEventPalletDecoder() }),
      'NominationPools.StateChanged': setupPallet({ decoder: new NominationPoolsStateChangedEventPalletDecoder() }),
      'NominationPools.PaidOut': setupPallet({ decoder: new NominationPoolsPaidOutEventPalletDecoder() }),
      'NominationPools.Withdrawn': setupPallet({ decoder: new NominationPoolsWithdrawnEventPalletDecoder() }),
      'XcmPallet.Sent': setupPallet({ decoder: new XcmSentEventPalletDecoder() }),
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
      'ConvictionVoting.delegate': setupPallet({ decoder: new DelegateCallPalletDecoder() }),
      'ConvictionVoting.undelegate': setupPallet({ decoder: new UndelegateCallPalletDecoder() }),
      'ConvictionVoting.vote': setupPallet({ decoder: new VoteCallPalletDecoder() }),
      'ConvictionVoting.remove_vote': setupPallet({ decoder: new RemoveVoteCallPalletDecoder() }),
      'NominationPools.create': setupPallet({ decoder: new CreatePoolCallPalletDecoder() }),
      'NominationPools.set_metadata': setupPallet({ decoder: new SetMetadataCallPalletDecoder() }),
      'NominationPools.update_roles': setupPallet({ decoder: new UpdateRolesCallPalletDecoder() }),
      'NominationPools.nominate': setupPallet({ decoder: new NominateCallPalletDecoder() }),
    },
  },
});
