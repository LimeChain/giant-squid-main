import { RewardEventPalletHandler } from '@/indexer/pallets/staking/events/reward';
import { AddSubCallPalletHandler } from '@/indexer/pallets/identity/calls/addSub';
import { SetSubsCallPalletHandler } from '@/indexer/pallets/identity/calls/setSubs';
import { TransferEventPalletHandler } from '@/indexer/pallets/balances/events/transfer';
import { RenameSubCallPalletHandler } from '@/indexer/pallets/identity/calls/renameSub';
import { SetIdentityCallPalletHandler } from '@/indexer/pallets/identity/calls/setIdentity';
import { KillIdentityCallPalletHandler } from '@/indexer/pallets/identity/calls/killIdentity';
import { ClearIdentityCallPalletHandler } from '@/indexer/pallets/identity/calls/clearIdentity';
import { ProvideJudgementCallPalletHandler } from '@/indexer/pallets/identity/calls/provideJudgement';
import { SubIdentityRemovedEventPalletHandler } from '@/indexer/pallets/identity/events/subIdentityRemoved';
import { SubIdentityRevokedEventPalletHandler } from '@/indexer/pallets/identity/events/subIdentityRevoked';
import { SlashEventPalletHandler } from '@/indexer/pallets/staking/events/slash';
import { BondedEventPalletHandler } from '@/indexer/pallets/staking/events/bonded';
import { UnBondedEventPalletHandler } from '@/indexer/pallets/staking/events/unbonded';
import { WithdrawnEventPalletHandler } from '@/indexer/pallets/staking/events/withdrawn';
import { RebondCallPalletHandler } from '@/indexer/pallets/staking/calls/rebond';
import { BondCallPalletHandler } from '@/indexer/pallets/staking/calls/bond';
import { UnbondCallPalletHandler } from '@/indexer/pallets/staking/calls/unbond';
import { BondExtraCallPalletHandler } from '@/indexer/pallets/staking/calls/bondExtra';
import { SetPayeeCallPalletHandler } from '@/indexer/pallets/staking/calls/setPayee';
import { SetControllerCallPalletHandler } from '@/indexer/pallets/staking/calls/setController';
import { CreateCallPalletHandler } from '@/indexer/pallets/crowdloan/calls/create';
import { DissolvedEventPalletHandler } from '@/indexer/pallets/crowdloan/events/dissolved';
import { ReservedParachainEventPalletHandler } from '@/indexer/pallets/crowdloan/events/reserved';
import { RegisteredParachainEventPalletHandler } from '@/indexer/pallets/crowdloan/events/registered';
import { DeregisteredParachainEventPalletHandler } from '@/indexer/pallets/crowdloan/events/deregistered';
import { ContributedEventPalletHandler } from '@/indexer/pallets/crowdloan/events/contributed';
import { PartiallyRefundedEventPalletHandler } from '@/indexer/pallets/crowdloan/events/partiallyRefunded';
import { AllRefundedEventPalletHandler } from '@/indexer/pallets/crowdloan/events/allRefunded';
import { WithdrewEventPalletHandler } from '@/indexer/pallets/crowdloan/events/withdrew';
import { ParachainRewardEventPalletHandler } from '@/indexer/pallets/parachain-staking/events/rewarded';
import { ParachainCompoundEventPalletHandler } from '@/indexer/pallets/parachain-staking/events/compounded';
import { ParachainDelegationEventPalletHandler } from '@/indexer/pallets/parachain-staking/events/delegation';
import { ParachainDelegationRevokedEventPalletHandler } from '@/indexer/pallets/parachain-staking/events/delegationRevoked';
import { ParachainDelegationKickedEventPalletHandler } from '@/indexer/pallets/parachain-staking/events/delegationKicked';
import { ParachainDelegationIncreasedEventPalletHandler } from '@/indexer/pallets/parachain-staking/events/delegationIncreased';
import { ParachainDelegationDecreasedEventPalletHandler } from '@/indexer/pallets/parachain-staking/events/delegationDecreased';
import { ParachainCandidateLeftEventPalletHandler } from '@/indexer/pallets/parachain-staking/events/candidateLeft';
import { ParachainCandidateBondedMoreEventPalletHandler } from '@/indexer/pallets/parachain-staking/events/candidateBondedMore';
import { ParachainCandidateBondedLessEventPalletHandler } from '@/indexer/pallets/parachain-staking/events/candidateBondedLess';
import { LimitedReserveTransferAssetsPalletHandler } from '@/indexer/pallets/xcm/calls/limitedReserveTransferAssets';
import { LimitedReserveTransferAssetsPalletHandler as LimitedReserveTransferAssetsPalletHandlerPolkadotXcm } from '@/indexer/pallets/polkadot-xcm/calls/limitedReserveTransferAssets';
import { TransferAssetsPalletHandler } from '@/indexer/pallets/xcm/calls/transferAssets';
import { LimitedTeleportAssetsPalletHandler } from '@/indexer/pallets/xcm/calls/limitedTeleportAssets';
import { TransferAssetsUsingTypeAndThenPalletHandler } from '@/indexer/pallets/xcm/calls/transferAssetsUsingTypeAndThen';
import { ReserveTransferAssetsPalletHandler } from '@/indexer/pallets/xcm/calls/reserveTransferAssets';
import { ReserveTransferAssetsPalletHandler as ReserveTransferAssetsPalletHandlerPolkadotXcm } from '@/indexer/pallets/polkadot-xcm/calls/reserveTransferAssets';
import { SentEventPalletHandler } from '@/indexer/pallets/polkadot-xcm/events/sent';
import { TransferredAssetsEventPalletHandler } from '@/indexer/pallets/x-tokens/events/transferredAssets';
import { UnlockCallPalletHandler } from '@/indexer/pallets/conviction-voting/calls/unlock';
import { VoteCallPalletHandler } from '@/indexer/pallets/conviction-voting/calls/vote';
import { DelegateCallPalletHandler } from '@/indexer/pallets/conviction-voting/calls/delegate';
import { UndelegateCallPalletHandler } from '@/indexer/pallets/conviction-voting/calls/undelegate';
import { RemoveVoteCallPalletHandler } from '@/indexer/pallets/conviction-voting/calls/removeVote';
import { TransferredMultiAssetsEventPalletHandler } from '@/indexer/pallets/x-tokens/events/transferredMultiAssets';
import { NominationPoolsBondedEventPalletHandler } from '@/indexer/pallets/nomination-pools/events/bonded';
import { NominationPoolsCreatePoolCallPalletHandler } from '@/indexer/pallets/nomination-pools/calls/create';
import { NominationPoolsSetMetadataCallPalletHandler } from '@/indexer/pallets/nomination-pools/calls/setMetadata';
import { NominationPoolsDestroyedEventPalletHandler } from '@/indexer/pallets/nomination-pools/events/destroyed';
import { NominationPoolsUnbondedEventPalletHandler } from '@/indexer/pallets/nomination-pools/events/unbonded';
import { NominationPoolsUpdateRolesCallPalletHandler } from '@/indexer/pallets/nomination-pools/calls/updateRoles';
import { NominationPoolsStateChangedEventPalletHandler } from '@/indexer/pallets/nomination-pools/events/stateChanged';
import { NominationPoolsPaidOutEventPalletHandler } from '@/indexer/pallets/nomination-pools/events/paidOut';
import { NominationPoolsWithdrawnEventPalletHandler } from '@/indexer/pallets/nomination-pools/events/withdrawn';
import { NominationPoolsNominateCallPalletHandler } from '@/indexer/pallets/nomination-pools/calls/nominate';

export const registry = {
  events: {
    'Balances.Transfer': TransferEventPalletHandler,
    'Staking.Reward': RewardEventPalletHandler,
    'Staking.Rewarded': RewardEventPalletHandler,
    'ParachainStaking.Rewarded': ParachainRewardEventPalletHandler,
    'ParachainStaking.Compounded': ParachainCompoundEventPalletHandler,
    'ParachainStaking.Delegation': ParachainDelegationEventPalletHandler,
    'ParachainStaking.DelegationRevoked': ParachainDelegationRevokedEventPalletHandler,
    'ParachainStaking.DelegationKicked': ParachainDelegationKickedEventPalletHandler,
    'ParachainStaking.DelegationIncreased': ParachainDelegationIncreasedEventPalletHandler,
    'ParachainStaking.DelegationDecreased': ParachainDelegationDecreasedEventPalletHandler,
    'ParachainStaking.CandidateLeft': ParachainCandidateLeftEventPalletHandler,
    'ParachainStaking.CandidateBondedMore': ParachainCandidateBondedMoreEventPalletHandler,
    'ParachainStaking.CandidateBondedLess': ParachainCandidateBondedLessEventPalletHandler,
    'Staking.Bonded': BondedEventPalletHandler,
    'Staking.Unbonded': UnBondedEventPalletHandler,
    'Staking.Withdrawn': WithdrawnEventPalletHandler,
    'Staking.Slash': SlashEventPalletHandler,
    'Staking.Slashed': SlashEventPalletHandler,
    'Identity.SubIdentityRemoved': SubIdentityRemovedEventPalletHandler,
    'Identity.SubIdentityRevoked': SubIdentityRevokedEventPalletHandler,
    'Crowdloan.Dissolved': DissolvedEventPalletHandler,
    'Crowdloan.Contributed': ContributedEventPalletHandler,
    'Crowdloan.PartiallyRefunded': PartiallyRefundedEventPalletHandler,
    'Crowdloan.AllRefunded': AllRefundedEventPalletHandler,
    'Crowdloan.Withdrew': WithdrewEventPalletHandler,
    'Registrar.Reserved': ReservedParachainEventPalletHandler,
    'Registrar.Registered': RegisteredParachainEventPalletHandler,
    'Registrar.Deregistered': DeregisteredParachainEventPalletHandler,
    'PolkadotXcm.Sent': SentEventPalletHandler,
    'XcmPallet.Sent': SentEventPalletHandler,
    'XTokens.TransferredAssets': TransferredAssetsEventPalletHandler,
    'XTokens.TransferredMultiAssets': TransferredMultiAssetsEventPalletHandler,
    'OrmlXTokens.TransferredAssets': TransferredAssetsEventPalletHandler,
    'OrmlXTokens.TransferredMultiAssets': TransferredMultiAssetsEventPalletHandler,
    'NominationPools.Bonded': NominationPoolsBondedEventPalletHandler,
    'NominationPools.Destroyed': NominationPoolsDestroyedEventPalletHandler,
    'NominationPools.Unbonded': NominationPoolsUnbondedEventPalletHandler,
    'NominationPools.StateChanged': NominationPoolsStateChangedEventPalletHandler,
    'NominationPools.PaidOut': NominationPoolsPaidOutEventPalletHandler,
    'NominationPools.Withdrawn': NominationPoolsWithdrawnEventPalletHandler,
  },
  calls: {
    'Identity.set_identity': SetIdentityCallPalletHandler,
    'Identity.set_subs': SetSubsCallPalletHandler,
    'Identity.provide_judgement': ProvideJudgementCallPalletHandler,
    'Identity.add_sub': AddSubCallPalletHandler,
    'Identity.clear_identity': ClearIdentityCallPalletHandler,
    'Identity.kill_identity': KillIdentityCallPalletHandler,
    'Identity.rename_sub': RenameSubCallPalletHandler,
    'Staking.rebond': RebondCallPalletHandler,
    'Staking.unbond': UnbondCallPalletHandler,
    'Staking.bond': BondCallPalletHandler,
    'Staking.bond_extra': BondExtraCallPalletHandler,
    'Staking.set_payee': SetPayeeCallPalletHandler,
    'Staking.set_controller': SetControllerCallPalletHandler,
    'Crowdloan.create': CreateCallPalletHandler,
    'XcmPallet.reserve_transfer_assets': ReserveTransferAssetsPalletHandler,
    'XcmPallet.limited_reserve_transfer_assets': LimitedReserveTransferAssetsPalletHandler,
    'XcmPallet.transfer_assets': TransferAssetsPalletHandler,
    'XcmPallet.limited_teleport_assets': LimitedTeleportAssetsPalletHandler,
    'XcmPallet.transfer_assets_using_type_and_then': TransferAssetsUsingTypeAndThenPalletHandler,
    'PolkadotXcm.reserve_transfer_assets': ReserveTransferAssetsPalletHandlerPolkadotXcm,
    'PolkadotXcm.limited_reserve_transfer_assets': LimitedReserveTransferAssetsPalletHandlerPolkadotXcm,
    'ConvictionVoting.unlock': UnlockCallPalletHandler,
    'ConvictionVoting.delegate': DelegateCallPalletHandler,
    'ConvictionVoting.undelegate': UndelegateCallPalletHandler,
    'ConvictionVoting.vote': VoteCallPalletHandler,
    'ConvictionVoting.remove_vote': RemoveVoteCallPalletHandler,
    'NominationPools.create': NominationPoolsCreatePoolCallPalletHandler,
    'NominationPools.set_metadata': NominationPoolsSetMetadataCallPalletHandler,
    'NominationPools.update_roles': NominationPoolsUpdateRolesCallPalletHandler,
    'NominationPools.nominate': NominationPoolsNominateCallPalletHandler,
  },
};

// Type to infer the constructor parameters
type ConstructorParametersOf<T> = T extends new (...args: infer P) => any ? P : never;

export type RegistryEvent = typeof registry.events;
export type RegistryCall = typeof registry.calls;

export type PalletSetups = {
  events?: {
    [K in keyof RegistryEvent]?: ConstructorParametersOf<RegistryEvent[K]>[0];
  };
  calls?: {
    [K in keyof RegistryCall]?: ConstructorParametersOf<RegistryCall[K]>[0];
  };
};
